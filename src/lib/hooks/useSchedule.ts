import { useState, useEffect, useCallback } from 'react'
import { ScheduleService } from '../services/schedule.service'
import type { Schedule, CreateScheduleInput, UpdateScheduleInput } from '../models/schedule'
import type { AppError } from '../firebase/errors'

export function useSchedule(options?: { technicianId?: string; clientId?: string }) {
  const [appointments, setAppointments] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<AppError | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      let result

      if (options?.technicianId) {
        result = await ScheduleService.getByTechnicianId(options.technicianId)
      } else if (options?.clientId) {
        result = await ScheduleService.getByClientId(options.clientId)
      } else {
        result = await ScheduleService.getAll()
      }

      if (result.error) {
        setError(result.error)
      } else {
        const data = result.data
        if (Array.isArray(data)) {
          setAppointments(data)
        } else if (data && 'items' in data) {
          setAppointments(data.items)
        } else {
          setAppointments([])
        }
      }
      setLoading(false)
    }
    load()
  }, [options?.technicianId, options?.clientId])

  const create = useCallback(async (data: CreateScheduleInput, userId?: string) => {
    const result = await ScheduleService.create(data, userId)
    return result.data || null
  }, [])

  const update = useCallback(async (id: string, data: UpdateScheduleInput, userId?: string) => {
    const result = await ScheduleService.update(id, data, userId)
    return result.data || null
  }, [])

  return { appointments, loading, error, create, update }
}

export function useTodayAppointments() {
  const [appointments, setAppointments] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const result = await ScheduleService.getToday()
      if (!result.error) {
        setAppointments(result.data || [])
      }
      setLoading(false)
    }
    load()
  }, [])

  return { appointments, loading }
}
