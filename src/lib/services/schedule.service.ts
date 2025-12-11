import { BaseService, type ServiceResult, type QueryFilter } from './base'
import type { Schedule } from '../models/schedule'

class ScheduleServiceClass extends BaseService<Schedule> {
  constructor() {
    super('schedules')
  }

  /**
   * Get appointments by technician ID
   */
  async getByTechnicianId(technicianId: string): Promise<ServiceResult<Schedule[]>> {
    const filters: QueryFilter[] = [
      { field: 'technicianId', operator: '==', value: technicianId }
    ]
    const result = await this.getAll(filters)
    if (result.error) {
      return { error: result.error }
    }
    return { data: result.data?.items || [] }
  }

  /**
   * Get appointments by client ID
   */
  async getByClientId(clientId: string): Promise<ServiceResult<Schedule[]>> {
    const filters: QueryFilter[] = [
      { field: 'clientId', operator: '==', value: clientId }
    ]
    const result = await this.getAll(filters)
    if (result.error) {
      return { error: result.error }
    }
    return { data: result.data?.items || [] }
  }

  /**
   * Get appointments by status
   */
  async getByStatus(status: string): Promise<ServiceResult<Schedule[]>> {
    const filters: QueryFilter[] = [
      { field: 'status', operator: '==', value: status }
    ]
    const result = await this.getAll(filters)
    if (result.error) {
      return { error: result.error }
    }
    return { data: result.data?.items || [] }
  }

  /**
   * Get appointments for a date range
   */
  async getByDateRange(startDate: Date, endDate: Date): Promise<ServiceResult<Schedule[]>> {
    const result = await this.getAll()
    if (result.error) {
      return { error: result.error }
    }

    const filtered = (result.data?.items || []).filter(appointment => {
      const appointmentDate = new Date(appointment.startDate)
      return appointmentDate >= startDate && appointmentDate <= endDate
    })

    return { data: filtered }
  }

  /**
   * Get today's appointments
   */
  async getToday(): Promise<ServiceResult<Schedule[]>> {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    return this.getByDateRange(today, tomorrow)
  }

  /**
   * Get upcoming appointments
   */
  async getUpcoming(daysAhead = 7): Promise<ServiceResult<Schedule[]>> {
    const now = new Date()
    const futureDate = new Date()
    futureDate.setDate(now.getDate() + daysAhead)

    return this.getByDateRange(now, futureDate)
  }

  /**
   * Get appointments requiring follow-up
   */
  async getRequiringFollowUp(): Promise<ServiceResult<Schedule[]>> {
    const result = await this.getAll()
    if (result.error) {
      return { error: result.error }
    }

    const filtered = (result.data?.items || []).filter(appointment =>
      appointment.followUpRequired && appointment.status === 'Completed'
    )

    return { data: filtered }
  }

  /**
   * Get upcoming appointments count
   */
  async getUpcomingCount(daysAhead = 7): Promise<ServiceResult<number>> {
    const result = await this.getUpcoming(daysAhead)
    if (result.error) {
      return { error: result.error }
    }
    return { data: result.data?.length || 0 }
  }

  /**
   * Get today's appointments count
   */
  async getTodayCount(): Promise<ServiceResult<number>> {
    const result = await this.getToday()
    if (result.error) {
      return { error: result.error }
    }
    return { data: result.data?.length || 0 }
  }
}

export const ScheduleService = new ScheduleServiceClass()
