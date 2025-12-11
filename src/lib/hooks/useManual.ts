import { useState, useEffect, useCallback } from 'react'
import { ManualService } from '../services/manual.service'
import type { Manual, CreateManualInput } from '../models/manual'
import type { AppError } from '../firebase/errors'

interface UseMenualsOptions {
  equipmentId?: string
  manufacturer?: string
  realtime?: boolean
}

interface UseMenualsReturn {
  manuals: Manual[]
  loading: boolean
  error: AppError | null
  uploading: boolean
  uploadManual: (
    file: File,
    manualData: Omit<CreateManualInput, 'storagePath' | 'downloadURL' | 'fileName' | 'fileSize' | 'mimeType' | 'uploadedAt'>,
    userId?: string
  ) => Promise<Manual | null>
  deleteManual: (id: string) => Promise<boolean>
  searchManuals: (searchTerm: string) => Promise<void>
  trackDownload: (id: string) => Promise<void>
  refresh: () => void
}

export function useManuals(options?: UseMenualsOptions): UseMenualsReturn {
  const [manuals, setManuals] = useState<Manual[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<AppError | null>(null)
  const [uploading, setUploading] = useState(false)

  const loadManuals = useCallback(async () => {
    setLoading(true)
    setError(null)

    let result
    if (options?.equipmentId) {
      result = await ManualService.getByEquipmentId(options.equipmentId)
    } else if (options?.manufacturer) {
      result = await ManualService.getByManufacturer(options.manufacturer)
    } else {
      result = await ManualService.getAll()
    }

    if (result.error) {
      setError(result.error)
    } else {
      const data = result.data
      if (Array.isArray(data)) {
        setManuals(data)
      } else if (data && 'items' in data) {
        setManuals(data.items)
      } else {
        setManuals([])
      }
    }
    setLoading(false)
  }, [options?.equipmentId, options?.manufacturer])

  useEffect(() => {
    loadManuals()
  }, [loadManuals])

  /**
   * Upload a new manual with file
   */
  const uploadManual = useCallback(async (
    file: File,
    manualData: Omit<CreateManualInput, 'storagePath' | 'downloadURL' | 'fileName' | 'fileSize' | 'mimeType' | 'uploadedAt'>,
    userId?: string
  ) => {
    setUploading(true)
    setError(null)

    const result = await ManualService.createWithFile(file, manualData, userId)

    if (result.error) {
      setError(result.error)
      setUploading(false)
      return null
    }

    // Reload manuals after successful upload
    await loadManuals()
    setUploading(false)
    return result.data || null
  }, [loadManuals])

  /**
   * Delete a manual (including file from storage)
   */
  const deleteManual = useCallback(async (id: string) => {
    setError(null)

    const result = await ManualService.deleteWithFile(id)

    if (result.error) {
      setError(result.error)
      return false
    }

    // Reload manuals after successful delete
    await loadManuals()
    return true
  }, [loadManuals])

  /**
   * Search manuals
   */
  const searchManuals = useCallback(async (searchTerm: string) => {
    setLoading(true)
    setError(null)

    const result = await ManualService.search(searchTerm)

    if (result.error) {
      setError(result.error)
    } else {
      setManuals(result.data || [])
    }
    setLoading(false)
  }, [])

  /**
   * Increment download count when manual is accessed
   */
  const trackDownload = useCallback(async (id: string) => {
    await ManualService.incrementDownloadCount(id)
  }, [])

  /**
   * Reload manuals
   */
  const refresh = useCallback(() => {
    loadManuals()
  }, [loadManuals])

  return {
    manuals,
    loading,
    error,
    uploading,
    uploadManual,
    deleteManual,
    searchManuals,
    trackDownload,
    refresh
  }
}
