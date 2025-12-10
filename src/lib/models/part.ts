import { z } from 'zod'
import { BaseDocument, BaseDocumentSchema, Status, StatusSchema } from './shared'

/**
 * Part/Inventory Model
 */

export type PartCategory = 'X-Ray Components' | 'Sensors' | 'Tubes' | 'Accessories' | 'Consumables' | 'Tools' | 'Other'

export interface Part extends BaseDocument {
  // Basic Info
  name: string
  sku: string
  category: PartCategory

  // Inventory
  quantity: number
  minQuantity: number
  unit: string

  // Pricing
  cost: number
  price: number
  supplier?: string

  // Compatibility
  manufacturers?: string[]
  models?: string[]

  // Location
  location?: string
  bin?: string

  // Status
  status: Status

  // Additional Info
  description?: string
  notes?: string
  imageUrl?: string
  datasheetUrl?: string
}

export const PartSchema = BaseDocumentSchema.extend({
  name: z.string().min(1, 'Name is required'),
  sku: z.string().min(1, 'SKU is required'),
  category: z.enum(['X-Ray Components', 'Sensors', 'Tubes', 'Accessories', 'Consumables', 'Tools', 'Other']),

  quantity: z.number().int().nonnegative('Quantity must be non-negative'),
  minQuantity: z.number().int().nonnegative('Minimum quantity must be non-negative'),
  unit: z.string().min(1, 'Unit is required'),

  cost: z.number().nonnegative('Cost must be non-negative'),
  price: z.number().nonnegative('Price must be non-negative'),
  supplier: z.string().optional(),

  manufacturers: z.array(z.string()).optional(),
  models: z.array(z.string()).optional(),

  location: z.string().optional(),
  bin: z.string().optional(),

  status: StatusSchema.default('Active'),

  description: z.string().optional(),
  notes: z.string().optional(),
  imageUrl: z.string().url().optional(),
  datasheetUrl: z.string().url().optional()
})

export type CreatePartInput = Omit<Part, keyof BaseDocument>
export type UpdatePartInput = Partial<Omit<Part, 'id' | 'createdAt' | 'createdBy'>>
