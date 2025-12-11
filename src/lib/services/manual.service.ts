import { BaseService, type ServiceResult, type QueryFilter } from './base'
import type { Manual, CreateManualInput } from '../models/manual'
import { getStorageInstance, db } from '../firebase/config'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { doc, setDoc, Timestamp } from 'firebase/firestore'
import { AppError } from '../firebase/errors'

class ManualServiceClass extends BaseService<Manual> {
  constructor() {
    super('manuals')
  }

  /**
   * Sanitize string for use in file paths (remove special chars, spaces -> underscores)
   */
  private sanitizeForPath(str: string): string {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, '_')
      .replace(/_{2,}/g, '_')
      .replace(/^_|_$/g, '')
  }

  /**
   * Upload PDF to Firebase Storage
   * Path: manuals/{manufacturer}/{model}/{docId}.pdf
   */
  async uploadManualFile(
    file: File,
    manufacturer: string,
    model: string,
    docId: string
  ): Promise<ServiceResult<{ storagePath: string; downloadURL: string }>> {
    try {
      // Validate file type
      if (file.type !== 'application/pdf') {
        return {
          error: {
            code: 'invalid-file-type',
            message: 'Only PDF files are allowed'
          } as AppError
        }
      }

      // Validate file size (max 50MB)
      const maxSize = 50 * 1024 * 1024 // 50MB in bytes
      if (file.size > maxSize) {
        return {
          error: {
            code: 'file-too-large',
            message: 'File size must be less than 50MB'
          } as AppError
        }
      }

      // Sanitize path components
      const sanitizedManufacturer = this.sanitizeForPath(manufacturer)
      const sanitizedModel = this.sanitizeForPath(model || 'general')

      // Build storage path
      const storagePath = `manuals/${sanitizedManufacturer}/${sanitizedModel}/${docId}.pdf`

      // Create storage reference and upload
      const storageRef = ref(getStorageInstance(), storagePath)
      const snapshot = await uploadBytes(storageRef, file, {
        contentType: 'application/pdf',
        customMetadata: {
          manufacturer,
          model: model || '',
          uploadedAt: new Date().toISOString()
        }
      })

      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref)

      return {
        data: {
          storagePath,
          downloadURL
        }
      }
    } catch (error) {
      console.error('Error uploading manual file:', error)
      return {
        error: {
          code: 'upload-failed',
          message: error instanceof Error ? error.message : 'Failed to upload file'
        } as AppError
      }
    }
  }

  /**
   * Delete file from Firebase Storage
   */
  async deleteManualFile(storagePath: string): Promise<ServiceResult<void>> {
    try {
      const storageRef = ref(getStorageInstance(), storagePath)
      await deleteObject(storageRef)
      return { data: undefined }
    } catch (error) {
      console.error('Error deleting manual file:', error)
      return {
        error: {
          code: 'delete-failed',
          message: error instanceof Error ? error.message : 'Failed to delete file'
        } as AppError
      }
    }
  }

  /**
   * Create manual with file upload
   */
  async createWithFile(
    file: File,
    manualData: Omit<CreateManualInput, 'storagePath' | 'downloadURL' | 'fileName' | 'fileSize' | 'mimeType' | 'uploadedAt'>,
    userId?: string
  ): Promise<ServiceResult<Manual>> {
    try {
      // Generate a new document ID
      const docRef = doc(db, this.collectionName)
      const docId = docRef.id

      // Upload file to storage
      const uploadResult = await this.uploadManualFile(
        file,
        manualData.manufacturer,
        manualData.model || '',
        docId
      )

      if (uploadResult.error) {
        return { error: uploadResult.error }
      }

      // Create manual document with file metadata
      const completeManualData = {
        ...manualData,
        storagePath: uploadResult.data!.storagePath,
        downloadURL: uploadResult.data!.downloadURL,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        uploadedAt: new Date(),
        uploadedBy: userId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        createdBy: userId,
        updatedBy: userId
      }

      // Save to Firestore with the specific ID
      const manualDocRef = doc(db, this.collectionName, docId)
      await setDoc(manualDocRef, completeManualData)

      // Fetch and return the created document
      const result = await this.getById(docId)
      return result
    } catch (error) {
      console.error('Error creating manual with file:', error)
      return {
        error: {
          code: 'create-failed',
          message: error instanceof Error ? error.message : 'Failed to create manual'
        } as AppError
      }
    }
  }

  /**
   * Delete manual and its file from storage
   */
  async deleteWithFile(id: string): Promise<ServiceResult<void>> {
    try {
      // Get manual to get storage path
      const manual = await this.getById(id)
      if (manual.error || !manual.data) {
        return { error: manual.error }
      }

      // Delete file from storage
      if (manual.data.storagePath) {
        const deleteFileResult = await this.deleteManualFile(manual.data.storagePath)
        if (deleteFileResult.error) {
          console.error('Failed to delete file from storage:', deleteFileResult.error)
          // Continue with Firestore deletion even if storage deletion fails
        }
      }

      // Delete document from Firestore
      const result = await this.delete(id)
      return result
    } catch (error) {
      console.error('Error deleting manual with file:', error)
      return {
        error: {
          code: 'delete-failed',
          message: error instanceof Error ? error.message : 'Failed to delete manual'
        } as AppError
      }
    }
  }

  /**
   * Get manuals by manufacturer
   */
  async getByManufacturer(manufacturer: string): Promise<ServiceResult<Manual[]>> {
    const filters: QueryFilter[] = [
      { field: 'manufacturer', operator: '==', value: manufacturer }
    ]
    const result = await this.getAll(filters)
    if (result.error) {
      return { error: result.error }
    }
    return { data: result.data?.items || [] }
  }

  /**
   * Get manuals by type
   */
  async getByType(type: string): Promise<ServiceResult<Manual[]>> {
    const filters: QueryFilter[] = [
      { field: 'type', operator: '==', value: type }
    ]
    const result = await this.getAll(filters)
    if (result.error) {
      return { error: result.error }
    }
    return { data: result.data?.items || [] }
  }

  /**
   * Get manuals by equipment ID
   */
  async getByEquipmentId(equipmentId: string): Promise<ServiceResult<Manual[]>> {
    const result = await this.getAll()
    if (result.error) {
      return { error: result.error }
    }

    const filtered = (result.data?.items || []).filter(manual =>
      manual.equipmentIds?.includes(equipmentId)
    )

    return { data: filtered }
  }

  /**
   * Search manuals by title or manufacturer
   */
  async search(searchTerm: string): Promise<ServiceResult<Manual[]>> {
    const allResult = await this.getAll()
    if (allResult.error) {
      return { error: allResult.error }
    }

    const filtered = (allResult.data?.items || []).filter(manual =>
      manual.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manual.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manual.model?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return { data: filtered }
  }

  /**
   * Increment download count
   */
  async incrementDownloadCount(id: string): Promise<ServiceResult<Manual>> {
    const manual = await this.getById(id)
    if (manual.error || !manual.data) {
      return manual
    }

    const downloadCount = (manual.data.downloadCount || 0) + 1
    return this.update(id, {
      downloadCount,
      lastAccessed: new Date()
    })
  }
}

export const ManualService = new ManualServiceClass()
