import { z } from 'zod'
import { BaseDocument, BaseDocumentSchema, EmailSchema, PhoneSchema, Address, AddressSchema, Coordinates, CoordinatesSchema, Status, StatusSchema } from './shared'

/**
 * Client/Account Model
 */

export type Territory = 'North' | 'South' | 'East' | 'West' | 'Central'
export type LoyaltyTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum'
export type ContractStatus = 'Active' | 'Expired' | 'Renewal Due' | 'Pending'

export interface Client extends BaseDocument {
  // Basic Info
  name: string
  accountNumber: string

  // Contact Info
  email?: string
  phone?: string
  address?: string | Address

  // Location
  lat?: number
  lng?: number
  coordinates?: Coordinates

  // Business Info
  territory?: Territory
  status: Status
  loyaltyTier?: LoyaltyTier
  contractStatus?: ContractStatus

  // Relationships
  equipmentCount?: number
  lastService?: Date
  nextService?: Date

  // Additional fields
  notes?: string
  tags?: string[]
}

/**
 * Zod Schema for validation
 */
export const ClientSchema = BaseDocumentSchema.extend({
  name: z.string().min(1, 'Name is required'),
  accountNumber: z.string().min(1, 'Account number is required'),

  email: EmailSchema.optional(),
  phone: PhoneSchema.optional(),
  address: z.union([z.string(), AddressSchema]).optional(),

  lat: z.number().optional(),
  lng: z.number().optional(),
  coordinates: CoordinatesSchema.optional(),

  territory: z.enum(['North', 'South', 'East', 'West', 'Central']).optional(),
  status: StatusSchema.default('Active'),
  loyaltyTier: z.enum(['Bronze', 'Silver', 'Gold', 'Platinum']).optional(),
  contractStatus: z.enum(['Active', 'Expired', 'Renewal Due', 'Pending']).optional(),

  equipmentCount: z.number().int().nonnegative().optional(),
  lastService: z.date().optional(),
  nextService: z.date().optional(),

  notes: z.string().optional(),
  tags: z.array(z.string()).optional()
})

/**
 * Type for creating a new client (omit computed fields)
 */
export type CreateClientInput = Omit<Client, keyof BaseDocument>

/**
 * Type for updating a client (all fields optional except ID)
 */
export type UpdateClientInput = Partial<Omit<Client, 'id' | 'createdAt' | 'createdBy'>>
