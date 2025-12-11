import { useState, useEffect } from 'react'
import { ManualService } from '../services/manual.service'
import type { Manual } from '../models/manual'

export function useManuals(equipmentId?: string) {
  const [manuals, setManuals] = useState<Manual[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const result = equipmentId
        ? await ManualService.getByEquipmentId(equipmentId)
        : await ManualService.getAll()

      if (!result.error && result.data) {
        // Handle both array and paginated result
        const items = Array.isArray(result.data) ? result.data : result.data.items
        setManuals(items || [])
      }
      setLoading(false)
    }
    load()
  }, [equipmentId])

  return { manuals, loading }
}
