import { z } from 'zod'
import { BaseDocument, BaseDocumentSchema } from './shared'

/**
 * Invoice Model
 */

export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled'
export type PaymentMethod = 'Cash' | 'Check' | 'Credit Card' | 'ACH' | 'Wire Transfer'

export interface InvoiceLineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
  partId?: string
  serviceId?: string
}

export interface Invoice extends BaseDocument {
  // Identification
  invoiceNumber: string

  // Client Info
  clientId: string
  clientName: string

  // Amounts
  subtotal: number
  tax: number
  total: number
  amountPaid: number
  amountDue: number

  // Line Items
  lineItems: InvoiceLineItem[]

  // Status & Dates
  status: InvoiceStatus
  invoiceDate: Date
  dueDate: Date
  paidDate?: Date

  // Payment
  paymentMethod?: PaymentMethod
  paymentReference?: string

  // Related Records
  appointmentId?: string
  equipmentIds?: string[]

  // Notes
  notes?: string
  terms?: string
}

const InvoiceLineItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().positive('Quantity must be positive'),
  unitPrice: z.number().nonnegative('Unit price must be non-negative'),
  total: z.number().nonnegative('Total must be non-negative'),
  partId: z.string().optional(),
  serviceId: z.string().optional()
})

export const InvoiceSchema = BaseDocumentSchema.extend({
  invoiceNumber: z.string().min(1, 'Invoice number is required'),

  clientId: z.string().min(1, 'Client ID is required'),
  clientName: z.string().min(1, 'Client name is required'),

  subtotal: z.number().nonnegative('Subtotal must be non-negative'),
  tax: z.number().nonnegative('Tax must be non-negative'),
  total: z.number().nonnegative('Total must be non-negative'),
  amountPaid: z.number().nonnegative('Amount paid must be non-negative'),
  amountDue: z.number().nonnegative('Amount due must be non-negative'),

  lineItems: z.array(InvoiceLineItemSchema).min(1, 'At least one line item is required'),

  status: z.enum(['Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled']).default('Draft'),
  invoiceDate: z.date(),
  dueDate: z.date(),
  paidDate: z.date().optional(),

  paymentMethod: z.enum(['Cash', 'Check', 'Credit Card', 'ACH', 'Wire Transfer']).optional(),
  paymentReference: z.string().optional(),

  appointmentId: z.string().optional(),
  equipmentIds: z.array(z.string()).optional(),

  notes: z.string().optional(),
  terms: z.string().optional()
})

export type CreateInvoiceInput = Omit<Invoice, keyof BaseDocument>
export type UpdateInvoiceInput = Partial<Omit<Invoice, 'id' | 'createdAt' | 'createdBy'>>
