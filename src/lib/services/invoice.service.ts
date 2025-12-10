import { BaseService, type ServiceResult, type QueryFilter } from './base'
import type { Invoice } from '../models/invoice'

class InvoiceServiceClass extends BaseService<Invoice> {
  constructor() {
    super('invoices')
  }

  /**
   * Get invoices by client ID
   */
  async getByClientId(clientId: string): Promise<ServiceResult<Invoice[]>> {
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
   * Get invoices by status
   */
  async getByStatus(status: string): Promise<ServiceResult<Invoice[]>> {
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
   * Get overdue invoices
   */
  async getOverdue(): Promise<ServiceResult<Invoice[]>> {
    const result = await this.getAll()
    if (result.error) {
      return { error: result.error }
    }

    const now = new Date()
    const filtered = (result.data?.items || []).filter(invoice => {
      if (invoice.status === 'Paid' || invoice.status === 'Cancelled') return false
      return new Date(invoice.dueDate) < now
    })

    return { data: filtered }
  }

  /**
   * Get unpaid invoices
   */
  async getUnpaid(): Promise<ServiceResult<Invoice[]>> {
    const filters: QueryFilter[] = [
      { field: 'status', operator: '!=', value: 'Paid' }
    ]
    const result = await this.getAll(filters)
    if (result.error) {
      return { error: result.error }
    }
    return { data: result.data?.items || [] }
  }

  /**
   * Calculate total revenue for a period
   */
  async getRevenue(startDate: Date, endDate: Date): Promise<ServiceResult<number>> {
    const result = await this.getAll()
    if (result.error) {
      return { error: result.error }
    }

    const filtered = (result.data?.items || []).filter(invoice => {
      const invoiceDate = new Date(invoice.invoiceDate)
      return invoiceDate >= startDate && invoiceDate <= endDate && invoice.status === 'Paid'
    })

    const total = filtered.reduce((sum, invoice) => sum + invoice.total, 0)
    return { data: total }
  }
}

export const InvoiceService = new InvoiceServiceClass()
