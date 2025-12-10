import { BaseService, type ServiceResult, type QueryFilter } from './base'
import type { Part } from '../models/part'

class PartServiceClass extends BaseService<Part> {
  constructor() {
    super('parts')
  }

  /**
   * Get part by SKU
   */
  async getBySKU(sku: string): Promise<ServiceResult<Part | null>> {
    const filters: QueryFilter[] = [
      { field: 'sku', operator: '==', value: sku }
    ]
    const result = await this.getAll(filters)
    if (result.error) {
      return { error: result.error }
    }
    const items = result.data?.items || []
    return { data: items.length > 0 ? items[0] : null }
  }

  /**
   * Get parts by category
   */
  async getByCategory(category: string): Promise<ServiceResult<Part[]>> {
    const filters: QueryFilter[] = [
      { field: 'category', operator: '==', value: category }
    ]
    const result = await this.getAll(filters)
    if (result.error) {
      return { error: result.error }
    }
    return { data: result.data?.items || [] }
  }

  /**
   * Get low stock parts
   */
  async getLowStock(): Promise<ServiceResult<Part[]>> {
    const result = await this.getAll()
    if (result.error) {
      return { error: result.error }
    }

    const filtered = (result.data?.items || []).filter(part =>
      part.quantity <= part.minQuantity
    )

    return { data: filtered }
  }

  /**
   * Get out of stock parts
   */
  async getOutOfStock(): Promise<ServiceResult<Part[]>> {
    const filters: QueryFilter[] = [
      { field: 'quantity', operator: '==', value: 0 }
    ]
    const result = await this.getAll(filters)
    if (result.error) {
      return { error: result.error }
    }
    return { data: result.data?.items || [] }
  }

  /**
   * Update part quantity
   */
  async updateQuantity(id: string, quantity: number, userId?: string): Promise<ServiceResult<Part>> {
    return this.update(id, { quantity }, userId)
  }

  /**
   * Search parts by name or SKU
   */
  async search(searchTerm: string): Promise<ServiceResult<Part[]>> {
    const allResult = await this.getAll()
    if (allResult.error) {
      return { error: allResult.error }
    }

    const filtered = (allResult.data?.items || []).filter(part =>
      part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.sku.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return { data: filtered }
  }
}

export const PartService = new PartServiceClass()
