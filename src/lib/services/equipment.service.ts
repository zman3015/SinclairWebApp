import { BaseService, type ServiceResult, type QueryFilter } from './base'
import type { Equipment } from '../models/equipment'

class EquipmentServiceClass extends BaseService<Equipment> {
  constructor() {
    super('equipment')
  }

  /**
   * Get equipment by client ID
   */
  async getByClientId(clientId: string): Promise<ServiceResult<Equipment[]>> {
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
   * Get equipment by type
   */
  async getByType(type: string): Promise<ServiceResult<Equipment[]>> {
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
   * Get equipment by QR code
   */
  async getByQRCode(qrCode: string): Promise<ServiceResult<Equipment | null>> {
    const filters: QueryFilter[] = [
      { field: 'qrCode', operator: '==', value: qrCode }
    ]
    const result = await this.getAll(filters)
    if (result.error) {
      return { error: result.error }
    }
    const items = result.data?.items || []
    return { data: items.length > 0 ? items[0] : null }
  }

  /**
   * Get equipment by serial number
   */
  async getBySerialNumber(serialNumber: string): Promise<ServiceResult<Equipment | null>> {
    const filters: QueryFilter[] = [
      { field: 'serialNumber', operator: '==', value: serialNumber }
    ]
    const result = await this.getAll(filters)
    if (result.error) {
      return { error: result.error }
    }
    const items = result.data?.items || []
    return { data: items.length > 0 ? items[0] : null }
  }

  /**
   * Get equipment requiring service soon
   */
  async getServiceDueSoon(daysAhead = 30): Promise<ServiceResult<Equipment[]>> {
    const result = await this.getAll()
    if (result.error) {
      return { error: result.error }
    }

    const now = new Date()
    const futureDate = new Date()
    futureDate.setDate(now.getDate() + daysAhead)

    const filtered = (result.data?.items || []).filter(equipment => {
      if (!equipment.nextService) return false
      const nextService = new Date(equipment.nextService)
      return nextService >= now && nextService <= futureDate
    })

    return { data: filtered }
  }

  /**
   * Get equipment with expired warranties
   */
  async getExpiredWarranties(): Promise<ServiceResult<Equipment[]>> {
    const result = await this.getAll()
    if (result.error) {
      return { error: result.error }
    }

    const now = new Date()
    const filtered = (result.data?.items || []).filter(equipment => {
      if (!equipment.warrantyExpiry) return false
      return new Date(equipment.warrantyExpiry) < now
    })

    return { data: filtered }
  }
}

export const EquipmentService = new EquipmentServiceClass()
