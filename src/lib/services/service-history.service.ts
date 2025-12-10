import { BaseService, type ServiceResult, type QueryFilter } from './base'
import type { ServiceHistory } from '../models/service-history'

class ServiceHistoryServiceClass extends BaseService<ServiceHistory> {
  constructor() {
    super('service-history')
  }

  /**
   * Get service history by equipment ID
   */
  async getByEquipmentId(equipmentId: string): Promise<ServiceResult<ServiceHistory[]>> {
    const filters: QueryFilter[] = [
      { field: 'equipmentId', operator: '==', value: equipmentId }
    ]
    const result = await this.getAll(filters, { orderByField: 'completedDate', orderByDirection: 'desc' })
    if (result.error) {
      return { error: result.error }
    }
    return { data: result.data?.items || [] }
  }

  /**
   * Get service history by client ID
   */
  async getByClientId(clientId: string): Promise<ServiceResult<ServiceHistory[]>> {
    const filters: QueryFilter[] = [
      { field: 'clientId', operator: '==', value: clientId }
    ]
    const result = await this.getAll(filters, { orderByField: 'completedDate', orderByDirection: 'desc' })
    if (result.error) {
      return { error: result.error }
    }
    return { data: result.data?.items || [] }
  }

  /**
   * Get service history by technician ID
   */
  async getByTechnicianId(technicianId: string): Promise<ServiceResult<ServiceHistory[]>> {
    const filters: QueryFilter[] = [
      { field: 'technicianId', operator: '==', value: technicianId }
    ]
    const result = await this.getAll(filters, { orderByField: 'completedDate', orderByDirection: 'desc' })
    if (result.error) {
      return { error: result.error }
    }
    return { data: result.data?.items || [] }
  }

  /**
   * Get service history by type
   */
  async getByType(type: string): Promise<ServiceResult<ServiceHistory[]>> {
    const filters: QueryFilter[] = [
      { field: 'type', operator: '==', value: type }
    ]
    const result = await this.getAll(filters)
    if (result.error) {
      return { error: result.error }
    }
    return { data: result.data?.items || [] }
  }

  /**
   * Get service history by status
   */
  async getByStatus(status: string): Promise<ServiceResult<ServiceHistory[]>> {
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
   * Get completed services
   */
  async getCompleted(): Promise<ServiceResult<ServiceHistory[]>> {
    return this.getByStatus('Completed')
  }

  /**
   * Get in-progress services
   */
  async getInProgress(): Promise<ServiceResult<ServiceHistory[]>> {
    return this.getByStatus('In Progress')
  }

  /**
   * Get warranty work
   */
  async getWarrantyWork(): Promise<ServiceResult<ServiceHistory[]>> {
    const filters: QueryFilter[] = [
      { field: 'warrantyWork', operator: '==', value: true }
    ]
    const result = await this.getAll(filters)
    if (result.error) {
      return { error: result.error }
    }
    return { data: result.data?.items || [] }
  }

  /**
   * Get services requiring follow-up
   */
  async getRequiringFollowUp(): Promise<ServiceResult<ServiceHistory[]>> {
    const filters: QueryFilter[] = [
      { field: 'followUpRequired', operator: '==', value: true }
    ]
    const result = await this.getAll(filters)
    if (result.error) {
      return { error: result.error }
    }
    return { data: result.data?.items || [] }
  }

  /**
   * Calculate total cost for a period
   */
  async getTotalCost(startDate: Date, endDate: Date): Promise<ServiceResult<number>> {
    const result = await this.getAll()
    if (result.error) {
      return { error: result.error }
    }

    const filtered = (result.data?.items || []).filter(service => {
      if (!service.completedDate) return false
      const completedDate = new Date(service.completedDate)
      return completedDate >= startDate && completedDate <= endDate
    })

    const total = filtered.reduce((sum, service) => sum + (service.totalCost || 0), 0)
    return { data: total }
  }
}

export const ServiceHistoryService = new ServiceHistoryServiceClass()
