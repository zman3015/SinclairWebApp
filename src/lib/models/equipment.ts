import { z } from 'zod'
import { BaseDocument, BaseDocumentSchema, Status, StatusSchema } from './shared'

/**
 * Equipment Model
 */

export type EquipmentType = 'Intraoral X-Ray' | 'Panoramic' | 'Cephalometric' | 'CBCT' | 'Autoclave' | 'Handpiece' | 'Compressor' | 'Suction' | 'Other'
export type EquipmentCondition = 'Excellent' | 'Good' | 'Fair' | 'Poor'

export interface Equipment extends BaseDocument {
  // Basic Info
  name: string
  type: EquipmentType
  manufacturer: string
  model: string

  // Identification
  serialNumber: string
  qrCode?: string
  xrisNumber?: string

  // Client Relationship
  clientId: string
  clientName?: string
  roomNumber?: string
  location?: string

  // Status & Condition
  status: Status
  condition?: EquipmentCondition

  // Dates
  installDate?: Date
  warrantyExpiry?: Date
  lastService?: Date
  nextService?: Date

  // Service tracking
  serviceHistory?: string[]
  maintenanceSchedule?: string

  // Additional Info
  notes?: string
  manualUrl?: string
  images?: string[]
  tags?: string[]
}

/**
 * Zod Schema for validation
 */
export const EquipmentSchema = BaseDocumentSchema.extend({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['Intraoral X-Ray', 'Panoramic', 'Cephalometric', 'CBCT', 'Autoclave', 'Handpiece', 'Compressor', 'Suction', 'Other']),
  manufacturer: z.string().min(1, 'Manufacturer is required'),
  model: z.string().min(1, 'Model is required'),

  serialNumber: z.string().min(1, 'Serial number is required'),
  qrCode: z.string().optional(),
  xrisNumber: z.string().optional(),

  clientId: z.string().min(1, 'Client ID is required'),
  clientName: z.string().optional(),
  roomNumber: z.string().optional(),
  location: z.string().optional(),

  status: StatusSchema.default('Active'),
  condition: z.enum(['Excellent', 'Good', 'Fair', 'Poor']).optional(),

  installDate: z.date().optional(),
  warrantyExpiry: z.date().optional(),
  lastService: z.date().optional(),
  nextService: z.date().optional(),

  serviceHistory: z.array(z.string()).optional(),
  maintenanceSchedule: z.string().optional(),

  notes: z.string().optional(),
  manualUrl: z.string().url().optional(),
  images: z.array(z.string().url()).optional(),
  tags: z.array(z.string()).optional()
})

export type CreateEquipmentInput = Omit<Equipment, keyof BaseDocument>
export type UpdateEquipmentInput = Partial<Omit<Equipment, 'id' | 'createdAt' | 'createdBy'>>
