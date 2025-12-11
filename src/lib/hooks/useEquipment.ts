import { useState, useEffect, useCallback } from 'react'
import { EquipmentService } from '../services/equipment.service'
import type { Equipment, CreateEquipmentInput, UpdateEquipmentInput } from '../models/equipment'
import type { AppError } from '../firebase/errors'

interface UseEquipmentOptions {
  equipmentId?: string
  clientId?: string
  realtime?: boolean
}

export function useEquipment(options?: UseEquipmentOptions) {
  const [equipment, setEquipment] = useState<Equipment | null>(null)
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<AppError | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)

      if (options?.equipmentId) {
        const result = await EquipmentService.getById(options.equipmentId)
        if (result.error) {
          setError(result.error)
        } else {
          setEquipment(result.data || null)
        }
      } else if (options?.clientId) {
        const result = await EquipmentService.getByClientId(options.clientId)
        if (result.error) {
          setError(result.error)
        } else {
          setEquipmentList(result.data || [])
        }
      } else {
        const result = await EquipmentService.getAll()
        if (result.error) {
          setError(result.error)
        } else {
          setEquipmentList(result.data?.items || [])
        }
      }

      setLoading(false)
    }

    load()
  }, [options?.equipmentId, options?.clientId])

  const create = useCallback(async (data: CreateEquipmentInput, userId?: string) => {
    const result = await EquipmentService.create(data, userId)
    if (result.error) {
      setError(result.error)
      return null
    }
    return result.data || null
  }, [])

  const update = useCallback(async (id: string, data: UpdateEquipmentInput, userId?: string) => {
    const result = await EquipmentService.update(id, data, userId)
    if (result.error) {
      setError(result.error)
      return null
    }
    return result.data || null
  }, [])

  const remove = useCallback(async (id: string) => {
    const result = await EquipmentService.delete(id)
    return !result.error
  }, [])

  return {
    equipment,
    equipmentList,
    loading,
    error,
    create,
    update,
    remove
  }
}

export function useEquipmentByQR(qrCode?: string) {
  const [equipment, setEquipment] = useState<Equipment | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<AppError | null>(null)

  useEffect(() => {
    if (!qrCode) return

    const load = async () => {
      setLoading(true)
      const result = await EquipmentService.getByQRCode(qrCode)
      if (result.error) {
        setError(result.error)
      } else {
        setEquipment(result.data || null)
      }
      setLoading(false)
    }

    load()
  }, [qrCode])

  return { equipment, loading, error }
}
