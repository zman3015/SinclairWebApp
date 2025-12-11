import { useState, useEffect, useCallback } from 'react'
import { RepairService } from '../services/repair.service'
import type { Repair, CreateRepairInput, UpdateRepairInput } from '../models/repair'
import type { AppError } from '../firebase/errors'

interface UseRepairOptions {
  repairId?: string
  equipmentId?: string
  clientId?: string
}

export function useRepair(options?: UseRepairOptions) {
  const [repair, setRepair] = useState<Repair | null>(null)
  const [repairs, setRepairs] = useState<Repair[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<AppError | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)

      if (options?.repairId) {
        const result = await RepairService.getById(options.repairId)
        if (result.error) {
          setError(result.error)
        } else {
          setRepair(result.data || null)
        }
      } else if (options?.equipmentId) {
        const result = await RepairService.getByEquipmentId(options.equipmentId)
        if (result.error) {
          setError(result.error)
        } else {
          setRepairs(result.data || [])
        }
      } else if (options?.clientId) {
        const result = await RepairService.getByClientId(options.clientId)
        if (result.error) {
          setError(result.error)
        } else {
          setRepairs(result.data || [])
        }
      } else {
        const result = await RepairService.getAll()
        if (result.error) {
          setError(result.error)
        } else {
          setRepairs(result.data?.items || [])
        }
      }

      setLoading(false)
    }

    load()
  }, [options?.repairId, options?.equipmentId, options?.clientId])

  const create = useCallback(async (data: CreateRepairInput, userId?: string) => {
    // Calculate total cost
    const totalPartsCost = data.partsUsed?.reduce((sum, part) => sum + (part.quantity * part.cost), 0) || 0
    const totalCost = (data.laborCost || 0) + totalPartsCost

    const repairData: CreateRepairInput = {
      ...data,
      totalPartsCost,
      totalCost
    }

    const result = await RepairService.create(repairData, userId)
    if (result.error) {
      setError(result.error)
      return null
    }
    return result.data || null
  }, [])

  const update = useCallback(async (id: string, data: UpdateRepairInput, userId?: string) => {
    // Recalculate total cost if parts or labor changed
    const updateData: UpdateRepairInput = { ...data }
    if (data.partsUsed !== undefined || data.laborCost !== undefined) {
      const totalPartsCost = data.partsUsed?.reduce((sum, part) => sum + (part.quantity * part.cost), 0) || 0
      const laborCost = data.laborCost || 0
      updateData.totalPartsCost = totalPartsCost
      updateData.totalCost = laborCost + totalPartsCost
    }

    const result = await RepairService.update(id, updateData, userId)
    if (result.error) {
      setError(result.error)
      return null
    }
    return result.data || null
  }, [])

  const remove = useCallback(async (id: string) => {
    const result = await RepairService.delete(id)
    return !result.error
  }, [])

  const retry = useCallback(() => {
    setLoading(true)
    setError(null)
    // Trigger re-fetch
    if (options?.repairId || options?.equipmentId || options?.clientId) {
      // Re-fetch will happen via useEffect
    }
  }, [options])

  return {
    repair,
    repairs,
    loading,
    error,
    create,
    update,
    remove,
    retry
  }
}
