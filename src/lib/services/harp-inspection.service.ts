import { BaseService, type ServiceResult, type QueryFilter } from './base'
import type { HarpInspection } from '../models/harp-inspection'

class HarpInspectionServiceClass extends BaseService<HarpInspection> {
  constructor() {
    super('harp-inspections')
  }

  /**
   * Get inspections by client ID
   */
  async getByClientId(clientId: string): Promise<ServiceResult<HarpInspection[]>> {
    const filters: QueryFilter[] = [
      { field: 'clientId', operator: '==', value: clientId }
    ]
    const result = await this.getAll(filters, { orderByField: 'inspectionDate', orderByDirection: 'desc' })
    if (result.error) {
      return { error: result.error }
    }
    return { data: result.data?.items || [] }
  }

  /**
   * Get inspections by equipment ID
   */
  async getByEquipmentId(equipmentId: string): Promise<ServiceResult<HarpInspection[]>> {
    const filters: QueryFilter[] = [
      { field: 'equipmentId', operator: '==', value: equipmentId }
    ]
    const result = await this.getAll(filters, { orderByField: 'inspectionDate', orderByDirection: 'desc' })
    if (result.error) {
      return { error: result.error }
    }
    return { data: result.data?.items || [] }
  }

  /**
   * Get inspections by technician ID
   */
  async getByTechnicianId(technicianId: string): Promise<ServiceResult<HarpInspection[]>> {
    const filters: QueryFilter[] = [
      { field: 'technicianId', operator: '==', value: technicianId }
    ]
    const result = await this.getAll(filters, { orderByField: 'inspectionDate', orderByDirection: 'desc' })
    if (result.error) {
      return { error: result.error }
    }
    return { data: result.data?.items || [] }
  }

  /**
   * Get inspections by status
   */
  async getByStatus(status: string): Promise<ServiceResult<HarpInspection[]>> {
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
   * Get failed inspections
   */
  async getFailed(): Promise<ServiceResult<HarpInspection[]>> {
    const filters: QueryFilter[] = [
      { field: 'passed', operator: '==', value: false }
    ]
    const result = await this.getAll(filters)
    if (result.error) {
      return { error: result.error }
    }
    return { data: result.data?.items || [] }
  }

  /**
   * Get completed inspections
   */
  async getCompleted(): Promise<ServiceResult<HarpInspection[]>> {
    const filters: QueryFilter[] = [
      { field: 'status', operator: '==', value: 'Completed' }
    ]
    const result = await this.getAll(filters, { orderByField: 'inspectionDate', orderByDirection: 'desc' })
    if (result.error) {
      return { error: result.error }
    }
    return { data: result.data?.items || [] }
  }

  /**
   * Get draft inspections
   */
  async getDrafts(): Promise<ServiceResult<HarpInspection[]>> {
    const filters: QueryFilter[] = [
      { field: 'status', operator: '==', value: 'Draft' }
    ]
    const result = await this.getAll(filters)
    if (result.error) {
      return { error: result.error }
    }
    return { data: result.data?.items || [] }
  }
}

export const HarpInspectionService = new HarpInspectionServiceClass()
