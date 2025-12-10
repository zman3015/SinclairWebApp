import { doc, runTransaction, Timestamp } from 'firebase/firestore'
import { BaseService, type ServiceResult, type QueryFilter } from './base'
import type { Invoice, CreateInvoiceInput, UpdateInvoiceInput } from '../models/invoice'
import { db } from '../firebase/config'
import { formatFirebaseError, logError } from '../firebase/errors'

class InvoiceServiceClass extends BaseService<Invoice> {
  constructor() {
    super('invoices')
  }

  /**
   * Generate next invoice number safely using Firestore transaction
   * Format: INV-YYYY-0001
   */
  async generateInvoiceNumber(): Promise<ServiceResult<string>> {
    try {
      const year = new Date().getFullYear()
      const counterRef = doc(db, 'counters', `invoice-${year}`)

      const invoiceNumber = await runTransaction(db, async (transaction) => {
        const counterDoc = await transaction.get(counterRef)

        let nextNumber = 1
        if (counterDoc.exists()) {
          nextNumber = (counterDoc.data().count || 0) + 1
        }

        transaction.set(counterRef, { count: nextNumber, year }, { merge: true })

        const paddedNumber = String(nextNumber).padStart(4, '0')
        return `INV-${year}-${paddedNumber}`
      })

      return { data: invoiceNumber }
    } catch (error) {
      const appError = formatFirebaseError(error)
      logError('InvoiceService.generateInvoiceNumber', error)
      return { error: appError }
    }
  }

  /**
   * Create invoice with auto-generated invoice number
   */
  async createWithNumber(
    data: Omit<CreateInvoiceInput, 'invoiceNumber'>,
    userId?: string
  ): Promise<ServiceResult<Invoice>> {
    const numberResult = await this.generateInvoiceNumber()
    if (numberResult.error) {
      return { error: numberResult.error }
    }

    return this.create(
      {
        ...data,
        invoiceNumber: numberResult.data!
      } as CreateInvoiceInput,
      userId
    )
  }

  /**
   * Mark invoice as paid
   */
  async markAsPaid(
    id: string,
    paymentMethod: string,
    paymentReference?: string,
    userId?: string
  ): Promise<ServiceResult<Invoice>> {
    const update: UpdateInvoiceInput = {
      status: 'Paid',
      paidDate: new Date(),
      paymentMethod: paymentMethod as Invoice['paymentMethod'],
      paymentReference,
      amountPaid: undefined, // Will be calculated from invoice
    }

    // Get the invoice first to calculate amountPaid
    const invoiceResult = await this.getById(id)
    if (invoiceResult.error || !invoiceResult.data) {
      return invoiceResult
    }

    update.amountPaid = invoiceResult.data.total
    update.amountDue = 0

    return this.update(id, update, userId)
  }

  /**
   * Get invoices by client ID
   */
  async getByClientId(clientId: string): Promise<ServiceResult<Invoice[]>> {
    const filters: QueryFilter[] = [
      { field: 'clientId', operator: '==', value: clientId }
    ]
    const result = await this.getAll(filters, { orderByField: 'invoiceDate', orderByDirection: 'desc' })
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
    const result = await this.getAll(filters, { orderByField: 'invoiceDate', orderByDirection: 'desc' })
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
    const result = await this.getAll()
    if (result.error) {
      return { error: result.error }
    }

    const filtered = (result.data?.items || []).filter(invoice =>
      invoice.status !== 'Paid' && invoice.status !== 'Cancelled'
    )

    return { data: filtered }
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

  /**
   * Get summary statistics
   */
  async getSummaryStats(): Promise<ServiceResult<{
    totalOutstanding: number
    paidThisMonth: number
    pending: number
    overdue: number
  }>> {
    const result = await this.getAll()
    if (result.error) {
      return { error: result.error }
    }

    const invoices = result.data?.items || []
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const stats = {
      totalOutstanding: 0,
      paidThisMonth: 0,
      pending: 0,
      overdue: 0
    }

    invoices.forEach(invoice => {
      if (invoice.status === 'Paid') {
        const paidDate = invoice.paidDate ? new Date(invoice.paidDate) : null
        if (paidDate && paidDate >= startOfMonth) {
          stats.paidThisMonth += invoice.total
        }
      } else if (invoice.status === 'Cancelled') {
        // Skip cancelled invoices
      } else {
        stats.totalOutstanding += invoice.amountDue

        if (invoice.status === 'Sent') {
          stats.pending += invoice.amountDue
        }

        const dueDate = new Date(invoice.dueDate)
        if (dueDate < now && invoice.status !== 'Paid') {
          stats.overdue += invoice.amountDue
        }
      }
    })

    return { data: stats }
  }
}

export const InvoiceService = new InvoiceServiceClass()
