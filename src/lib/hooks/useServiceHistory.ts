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

      if (!result.error) {
        const data = result.data
        if (Array.isArray(data)) {
          setHistory(data)
        } else if (data && 'items' in data) {
          setHistory(data.items)
        } else {
          setHistory([])
        }
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
