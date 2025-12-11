import { useState, useEffect, useCallback } from 'react'
import { HarpInspectionService } from '../services/harp-inspection.service'
import type { HarpInspection, CreateHarpInspectionInput, UpdateHarpInspectionInput } from '../models/harp-inspection'

export function useHarpInspections(clientId?: string) {
  const [inspections, setInspections] = useState<HarpInspection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const result = clientId
        ? await HarpInspectionService.getByClientId(clientId)
        : await HarpInspectionService.getAll()

      if (!result.error) {
        setInspections(result.data?.items || result.data || [])
      }
      setLoading(false)
    }
    load()
  }, [clientId])

  const create = useCallback(async (data: CreateHarpInspectionInput, userId?: string) => {
    const result = await HarpInspectionService.create(data, userId)
    return result.data || null
  }, [])

  const update = useCallback(async (id: string, data: UpdateHarpInspectionInput, userId?: string) => {
    const result = await HarpInspectionService.update(id, data, userId)
    return result.data || null
  }, [])

  return { inspections, loading, create, update }
}
