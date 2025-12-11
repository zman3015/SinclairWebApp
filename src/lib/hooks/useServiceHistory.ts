import { useState, useEffect, useCallback } from 'react'
import { ServiceHistoryService } from '../services/service-history.service'
import type { ServiceHistory, CreateServiceHistoryInput, UpdateServiceHistoryInput } from '../models/service-history'

export function useServiceHistory(equipmentId?: string) {
  const [history, setHistory] = useState<ServiceHistory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const result = equipmentId
        ? await ServiceHistoryService.getByEquipmentId(equipmentId)
        : await ServiceHistoryService.getAll()

      if (!result.error && result.data) {
        // Handle both array and paginated result
        const items = Array.isArray(result.data) ? result.data : result.data.items
        setHistory(items || [])
      }
      setLoading(false)
    }
    load()
  }, [equipmentId])

  const create = useCallback(async (data: CreateServiceHistoryInput, userId?: string) => {
    const result = await ServiceHistoryService.create(data, userId)
    return result.data || null
  }, [])

  const update = useCallback(async (id: string, data: UpdateServiceHistoryInput, userId?: string) => {
    const result = await ServiceHistoryService.update(id, data, userId)
    return result.data || null
  }, [])

  return { history, loading, create, update }
}
