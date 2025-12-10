import { BaseService, type ServiceResult, type QueryFilter } from './base'
import type { Manual } from '../models/manual'

class ManualServiceClass extends BaseService<Manual> {
  constructor() {
    super('manuals')
  }

  /**
   * Get manuals by manufacturer
   */
  async getByManufacturer(manufacturer: string): Promise<ServiceResult<Manual[]>> {
    const filters: QueryFilter[] = [
      { field: 'manufacturer', operator: '==', value: manufacturer }
    ]
    const result = await this.getAll(filters)
    if (result.error) {
      return { error: result.error }
    }
    return { data: result.data?.items || [] }
  }

  /**
   * Get manuals by type
   */
  async getByType(type: string): Promise<ServiceResult<Manual[]>> {
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
   * Get manuals by equipment ID
   */
  async getByEquipmentId(equipmentId: string): Promise<ServiceResult<Manual[]>> {
    const result = await this.getAll()
    if (result.error) {
      return { error: result.error }
    }

    const filtered = (result.data?.items || []).filter(manual =>
      manual.equipmentIds?.includes(equipmentId)
    )

    return { data: filtered }
  }

  /**
   * Search manuals by title or manufacturer
   */
  async search(searchTerm: string): Promise<ServiceResult<Manual[]>> {
    const allResult = await this.getAll()
    if (allResult.error) {
      return { error: allResult.error }
    }

    const filtered = (allResult.data?.items || []).filter(manual =>
      manual.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manual.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manual.model?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return { data: filtered }
  }

  /**
   * Increment download count
   */
  async incrementDownloadCount(id: string): Promise<ServiceResult<Manual>> {
    const manual = await this.getById(id)
    if (manual.error || !manual.data) {
      return manual
    }

    const downloadCount = (manual.data.downloadCount || 0) + 1
    return this.update(id, {
      downloadCount,
      lastAccessed: new Date()
    })
  }
}

export const ManualService = new ManualServiceClass()
