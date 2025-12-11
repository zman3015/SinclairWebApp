import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  UploadTaskSnapshot,
  type FirebaseStorage
} from 'firebase/storage'
import { collection, doc, setDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore'
import { db, getStorageInstance } from '../firebase'
import { BaseService } from './base'
import { Photo, PhotoSchema, CreatePhotoInput } from '../models/photo'
import { AppError } from '../errors'
import imageCompression from 'browser-image-compression'

const COLLECTIONS = {
  EQUIPMENT_PHOTOS: 'equipment-photos',
  REPAIR_PHOTOS: 'repair-photos'
}

const STORAGE_PATHS = {
  EQUIPMENT: 'equipment',
  REPAIRS: 'repairs'
}

// File validation constants
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

// Compression options
const COMPRESSION_OPTIONS = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  fileType: 'image/jpeg'
}

export class PhotoService extends BaseService<Photo> {
  private _storage: FirebaseStorage | null = null

  constructor(collectionName: string) {
    super(collectionName)
  }

  private get storage() {
    if (!this._storage) {
      this._storage = getStorageInstance()
    }
    return this._storage
  }

  /**
   * Validate file before upload
   */
  private validateFile(file: File): void {
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new AppError(
        `Invalid file type. Allowed types: ${ALLOWED_TYPES.join(', ')}`,
        'INVALID_FILE_TYPE'
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new AppError(
        `File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        'FILE_TOO_LARGE'
      )
    }
  }

  /**
   * Compress image file
   */
  private async compressImage(file: File): Promise<File> {
    try {
      const compressedFile = await imageCompression(file, COMPRESSION_OPTIONS)
      console.log(`Image compressed: ${file.size} -> ${compressedFile.size} bytes`)
      return compressedFile
    } catch (error) {
      console.error('Image compression failed:', error)
      // Return original file if compression fails
      return file
    }
  }

  /**
   * Get image dimensions
   */
  private async getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const url = URL.createObjectURL(file)

      img.onload = () => {
        URL.revokeObjectURL(url)
        resolve({ width: img.width, height: img.height })
      }

      img.onerror = () => {
        URL.revokeObjectURL(url)
        reject(new Error('Failed to load image'))
      }

      img.src = url
    })
  }

  /**
   * Upload equipment photo
   */
  async uploadEquipmentPhoto(
    equipmentId: string,
    file: File,
    userId: string,
    userName: string,
    onProgress?: (progress: number) => void
  ): Promise<Photo> {
    // Validate file
    this.validateFile(file)

    // Compress image
    const compressedFile = await this.compressImage(file)

    // Get image dimensions
    let dimensions: { width: number; height: number } | undefined
    try {
      dimensions = await this.getImageDimensions(compressedFile)
    } catch (error) {
      console.warn('Failed to get image dimensions:', error)
    }

    // Generate photo ID
    const photoId = crypto.randomUUID()

    // Storage path
    const storagePath = `${STORAGE_PATHS.EQUIPMENT}/${equipmentId}/photos/${photoId}.jpg`
    const storageRef = ref(this.storage, storagePath)

    // Upload file
    const uploadTask = uploadBytesResumable(storageRef, compressedFile, {
      contentType: 'image/jpeg'
    })

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot: UploadTaskSnapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          onProgress?.(progress)
        },
        (error) => {
          reject(new AppError(`Upload failed: ${error.message}`, 'UPLOAD_FAILED'))
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)

            // Create photo document
            const photoData: CreatePhotoInput = {
              equipmentId,
              storagePath,
              downloadURL,
              fileName: file.name,
              contentType: 'image/jpeg',
              size: compressedFile.size,
              width: dimensions?.width,
              height: dimensions?.height,
              uploadedAt: new Date(),
              uploadedBy: userId,
              uploadedByName: userName
            }

            const result = await this.create(photoData)
            if (result.error) {
              reject(result.error)
            } else if (result.data) {
              resolve(result.data)
            } else {
              reject(new AppError('Failed to create photo document', 'CREATE_FAILED'))
            }
          } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            reject(new AppError(`Failed to create photo document: ${error.message}`, 'CREATE_FAILED'))
          }
        }
      )
    })
  }

  /**
   * Upload repair photo
   */
  async uploadRepairPhoto(
    repairId: string,
    file: File,
    userId: string,
    userName: string,
    isBeforePhoto: boolean,
    onProgress?: (progress: number) => void
  ): Promise<Photo> {
    // Validate file
    this.validateFile(file)

    // Compress image
    const compressedFile = await this.compressImage(file)

    // Get image dimensions
    let dimensions: { width: number; height: number } | undefined
    try {
      dimensions = await this.getImageDimensions(compressedFile)
    } catch (error) {
      console.warn('Failed to get image dimensions:', error)
    }

    // Generate photo ID
    const photoId = crypto.randomUUID()

    // Storage path
    const photoType = isBeforePhoto ? 'before' : 'after'
    const storagePath = `${STORAGE_PATHS.REPAIRS}/${repairId}/photos/${photoType}-${photoId}.jpg`
    const storageRef = ref(this.storage, storagePath)

    // Upload file
    const uploadTask = uploadBytesResumable(storageRef, compressedFile, {
      contentType: 'image/jpeg'
    })

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot: UploadTaskSnapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          onProgress?.(progress)
        },
        (error) => {
          reject(new AppError(`Upload failed: ${error.message}`, 'UPLOAD_FAILED'))
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)

            // Create photo document
            const photoData: CreatePhotoInput = {
              repairId,
              storagePath,
              downloadURL,
              fileName: file.name,
              contentType: 'image/jpeg',
              size: compressedFile.size,
              width: dimensions?.width,
              height: dimensions?.height,
              uploadedAt: new Date(),
              uploadedBy: userId,
              uploadedByName: userName,
              isBeforePhoto
            }

            const result = await this.create(photoData)
            if (result.error) {
              reject(result.error)
            } else if (result.data) {
              resolve(result.data)
            } else {
              reject(new AppError('Failed to create photo document', 'CREATE_FAILED'))
            }
          } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            reject(new AppError(`Failed to create photo document: ${error.message}`, 'CREATE_FAILED'))
          }
        }
      )
    })
  }

  /**
   * Delete photo (both Firestore doc and Storage file)
   */
  async deletePhoto(photoId: string): Promise<void> {
    // Get photo document
    const result = await this.getById(photoId)
    if (result.error || !result.data) {
      throw result.error || new AppError('Photo not found', 'NOT_FOUND')
    }

    const photo = result.data

    // Delete from Storage
    const storageRef = ref(this.storage, photo.storagePath)
    try {
      await deleteObject(storageRef)
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      // Ignore if file doesn't exist
      if (error.code !== 'storage/object-not-found') {
        throw new AppError(`Failed to delete storage file: ${error.message}`, 'DELETE_FAILED')
      }
    }

    // Delete from Firestore
    await this.delete(photoId)
  }

  /**
   * Get all photos for equipment
   */
  async getEquipmentPhotos(equipmentId: string): Promise<Photo[]> {
    const q = query(
      collection(db, this.collectionName),
      where('equipmentId', '==', equipmentId)
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Photo))
  }

  /**
   * Get all photos for repair
   */
  async getRepairPhotos(repairId: string): Promise<Photo[]> {
    const q = query(
      collection(db, this.collectionName),
      where('repairId', '==', repairId)
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Photo))
  }

  /**
   * Get before photos for repair
   */
  async getRepairBeforePhotos(repairId: string): Promise<Photo[]> {
    const photos = await this.getRepairPhotos(repairId)
    return photos.filter(photo => photo.isBeforePhoto === true)
  }

  /**
   * Get after photos for repair
   */
  async getRepairAfterPhotos(repairId: string): Promise<Photo[]> {
    const photos = await this.getRepairPhotos(repairId)
    return photos.filter(photo => photo.isBeforePhoto === false)
  }
}

// Export service instances
export const equipmentPhotoService = new PhotoService(COLLECTIONS.EQUIPMENT_PHOTOS)
export const repairPhotoService = new PhotoService(COLLECTIONS.REPAIR_PHOTOS)
