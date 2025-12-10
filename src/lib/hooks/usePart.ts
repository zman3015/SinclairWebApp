import { useState, useEffect, useCallback } from 'react'
import { PartService } from '../services/part.service'
import type { Part, CreatePartInput, UpdatePartInput } from '../models/part'
import type { AppError } from '../firebase/errors'

export function useParts() {
  const [parts, setParts] = useState<Part[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<AppError | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const result = await PartService.getAll()
      if (result.error) {
        setError(result.error)
      } else {
        setParts(result.data?.items || [])
      }
      setLoading(false)
    }
    load()
  }, [])

  const create = useCallback(async (data: CreatePartInput, userId?: string) => {
    const result = await PartService.create(data, userId)
    return result.data || null
  }, [])

  const update = useCallback(async (id: string, data: UpdatePartInput, userId?: string) => {
    const result = await PartService.update(id, data, userId)
    return result.data || null
  }, [])

  return { parts, loading, error, create, update }
}

export function useLowStockParts() {
  const [parts, setParts] = useState<Part[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const result = await PartService.getLowStock()
      if (!result.error) {
        setParts(result.data || [])
      }
      setLoading(false)
    }
    load()
  }, [])

  return { parts, loading }
}
