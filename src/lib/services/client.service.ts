import { BaseService, type ServiceResult, type QueryFilter } from './base'
import type { Client, CreateClientInput, UpdateClientInput } from '../models/client'

class ClientServiceClass extends BaseService<Client> {
  constructor() {
    super('clients')
  }

  /**
   * Get clients by territory
   */
  async getByTerritory(territory: string): Promise<ServiceResult<Client[]>> {
    const filters: QueryFilter[] = [
      { field: 'territory', operator: '==', value: territory }
    ]
    const result = await this.getAll(filters)
    if (result.error) {
      return { error: result.error }
    }
    return { data: result.data?.items || [] }
  }

  /**
   * Get active clients
   */
  async getActive(): Promise<ServiceResult<Client[]>> {
    const filters: QueryFilter[] = [
      { field: 'status', operator: '==', value: 'Active' }
    ]
    const result = await this.getAll(filters)
    if (result.error) {
      return { error: result.error }
    }
    return { data: result.data?.items || [] }
  }

  /**
   * Get clients by loyalty tier
   */
  async getByLoyaltyTier(tier: string): Promise<ServiceResult<Client[]>> {
    const filters: QueryFilter[] = [
      { field: 'loyaltyTier', operator: '==', value: tier }
    ]
    const result = await this.getAll(filters)
    if (result.error) {
      return { error: result.error }
    }
    return { data: result.data?.items || [] }
  }

  /**
   * Search clients by name or account number
   */
  async search(searchTerm: string): Promise<ServiceResult<Client[]>> {
    // Note: For better search, consider using Algolia or similar
    // This is a basic implementation using Firestore
    const allResult = await this.getAll()
    if (allResult.error) {
      return { error: allResult.error }
    }

    const filtered = (allResult.data?.items || []).filter(client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.accountNumber.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return { data: filtered }
  }

  /**
   * Get clients with upcoming service dates
   */
  async getUpcomingService(daysAhead = 30): Promise<ServiceResult<Client[]>> {
    const result = await this.getAll()
    if (result.error) {
      return { error: result.error }
    }

    const now = new Date()
    const futureDate = new Date()
    futureDate.setDate(now.getDate() + daysAhead)

    const filtered = (result.data?.items || []).filter(client => {
      if (!client.nextService) return false
      const nextService = new Date(client.nextService)
      return nextService >= now && nextService <= futureDate
    })

    return { data: filtered }
  }
}

export const ClientService = new ClientServiceClass()
