import { useState, useEffect, useCallback } from 'react'
import { equipmentPhotoService, repairPhotoService } from '../services/photo.service'
import { Photo } from '../models/photo'
import { AppError } from '../errors'

export interface UsePhotoOptions {
  equipmentId?: string
  repairId?: string
  autoFetch?: boolean
}

export interface UsePhotoReturn {
  photos: Photo[]
  beforePhotos: Photo[]
  afterPhotos: Photo[]
  loading: boolean
  error: AppError | null
  uploading: boolean
  uploadProgress: number
  uploadEquipmentPhoto: (file: File, userId: string, userName: string) => Promise<Photo | null>
  uploadRepairPhoto: (file: File, userId: string, userName: string, isBeforePhoto: boolean) => Promise<Photo | null>
  deletePhoto: (photoId: string) => Promise<boolean>
  refetch: () => Promise<void>
}

export function usePhoto(options: UsePhotoOptions = {}): UsePhotoReturn {
  const { equipmentId, repairId, autoFetch = true } = options

  const [photos, setPhotos] = useState<Photo[]>([])
  const [beforePhotos, setBeforePhotos] = useState<Photo[]>([])
  const [afterPhotos, setAfterPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<AppError | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const fetchPhotos = useCallback(async () => {
    if (!equipmentId && !repairId) return

    setLoading(true)
    setError(null)

    try {
      if (equipmentId) {
        const data = await equipmentPhotoService.getEquipmentPhotos(equipmentId)
        setPhotos(data)
      } else if (repairId) {
        const [allPhotos, before, after] = await Promise.all([
          repairPhotoService.getRepairPhotos(repairId),
          repairPhotoService.getRepairBeforePhotos(repairId),
          repairPhotoService.getRepairAfterPhotos(repairId)
        ])
        setPhotos(allPhotos)
        setBeforePhotos(before)
        setAfterPhotos(after)
      }
    } catch (err) {
      const appError = err instanceof AppError ? err : new AppError('Failed to fetch photos', 'FETCH_ERROR')
      setError(appError)
      console.error('Error fetching photos:', err)
    } finally {
      setLoading(false)
    }
  }, [equipmentId, repairId])

  useEffect(() => {
    if (autoFetch) {
      fetchPhotos()
    }
  }, [autoFetch, fetchPhotos])

  const uploadEquipmentPhoto = async (
    file: File,
    userId: string,
    userName: string
  ): Promise<Photo | null> => {
    if (!equipmentId) {
      setError(new AppError('Equipment ID is required', 'INVALID_INPUT'))
      return null
    }

    setUploading(true)
    setUploadProgress(0)
    setError(null)

    try {
      const photo = await equipmentPhotoService.uploadEquipmentPhoto(
        equipmentId,
        file,
        userId,
        userName,
        (progress) => setUploadProgress(progress)
      )

      // Add to local state
      setPhotos(prev => [...prev, photo])
      return photo
    } catch (err) {
      const appError = err instanceof AppError ? err : new AppError('Upload failed', 'UPLOAD_ERROR')
      setError(appError)
      console.error('Error uploading equipment photo:', err)
      return null
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const uploadRepairPhoto = async (
    file: File,
    userId: string,
    userName: string,
    isBeforePhoto: boolean
  ): Promise<Photo | null> => {
    if (!repairId) {
      setError(new AppError('Repair ID is required', 'INVALID_INPUT'))
      return null
    }

    setUploading(true)
    setUploadProgress(0)
    setError(null)

    try {
      const photo = await repairPhotoService.uploadRepairPhoto(
        repairId,
        file,
        userId,
        userName,
        isBeforePhoto,
        (progress) => setUploadProgress(progress)
      )

      // Add to local state
      setPhotos(prev => [...prev, photo])
      if (isBeforePhoto) {
        setBeforePhotos(prev => [...prev, photo])
      } else {
        setAfterPhotos(prev => [...prev, photo])
      }
      return photo
    } catch (err) {
      const appError = err instanceof AppError ? err : new AppError('Upload failed', 'UPLOAD_ERROR')
      setError(appError)
      console.error('Error uploading repair photo:', err)
      return null
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const deletePhoto = async (photoId: string): Promise<boolean> => {
    setError(null)

    try {
      const service = equipmentId ? equipmentPhotoService : repairPhotoService
      await service.deletePhoto(photoId)

      // Remove from local state
      setPhotos(prev => prev.filter(p => p.id !== photoId))
      setBeforePhotos(prev => prev.filter(p => p.id !== photoId))
      setAfterPhotos(prev => prev.filter(p => p.id !== photoId))
      return true
    } catch (err) {
      const appError = err instanceof AppError ? err : new AppError('Delete failed', 'DELETE_ERROR')
      setError(appError)
      console.error('Error deleting photo:', err)
      return false
    }
  }

  return {
    photos,
    beforePhotos,
    afterPhotos,
    loading,
    error,
    uploading,
    uploadProgress,
    uploadEquipmentPhoto,
    uploadRepairPhoto,
    deletePhoto,
    refetch: fetchPhotos
  }
}
