import { BaseService, type ServiceResult, type QueryFilter } from './base'
import type { Repair } from '../models/repair'

class RepairServiceClass extends BaseService<Repair> {
  constructor() {
    super('repairs')
  }

  /**
   * Get repairs by equipment ID
   */
  async getByEquipmentId(equipmentId: string): Promise<ServiceResult<Repair[]>> {
    const filters: QueryFilter[] = [
      { field: 'equipmentId', operator: '==', value: equipmentId }
    ]
    const result = await this.getAll(filters, {
      orderByField: 'reportedDate',
      orderByDirection: 'desc'
    })
    if (result.error) {
      return { error: result.error }
    }
    return { data: result.data?.items || [] }
  }

  /**
   * Get repairs by client ID
   */
  async getByClientId(clientId: string): Promise<ServiceResult<Repair[]>> {
    const filters: QueryFilter[] = [
      { field: 'clientId', operator: '==', value: clientId }
    ]
    const result = await this.getAll(filters, {
      orderByField: 'reportedDate',
      orderByDirection: 'desc'
    })
    if (result.error) {
      return { error: result.error }
    }
    return { data: result.data?.items || [] }
  }

  /**
   * Get repairs by status
   */
  async getByStatus(status: string): Promise<ServiceResult<Repair[]>> {
    const filters: QueryFilter[] = [
      { field: 'status', operator: '==', value: status }
    ]
    const result = await this.getAll(filters, {
      orderByField: 'reportedDate',
      orderByDirection: 'desc'
    })
    if (result.error) {
      return { error: result.error }
    }
    return { data: result.data?.items || [] }
  }

  /**
   * Get open repairs
   */
  async getOpenRepairs(): Promise<ServiceResult<Repair[]>> {
    const filters: QueryFilter[] = [
      { field: 'status', operator: 'in', value: ['Open', 'In Progress'] }
    ]
    const result = await this.getAll(filters, {
      orderByField: 'reportedDate',
      orderByDirection: 'desc'
    })
    if (result.error) {
      return { error: result.error }
    }
    return { data: result.data?.items || [] }
  }

  /**
   * Calculate total cost for a repair
   */
  calculateTotalCost(repair: Partial<Repair>): number {
    const laborCost = repair.laborCost || 0
    const partsCost = repair.partsUsed?.reduce((sum, part) => sum + (part.quantity * part.cost), 0) || 0
    return laborCost + partsCost
  }
}

export const RepairService = new RepairServiceClass()
