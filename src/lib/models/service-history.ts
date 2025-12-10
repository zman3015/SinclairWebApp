import { z } from 'zod'
import { BaseDocument, BaseDocumentSchema, Priority, PrioritySchema } from './shared'

/**
 * Service History/Repair Model
 */

export type ServiceType = 'Repair' | 'Maintenance' | 'Installation' | 'Inspection' | 'Calibration' | 'Upgrade' | 'Emergency'
export type ServiceStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled' | 'On Hold'

export interface PartUsed {
  partId: string
  partName: string
  sku: string
  quantity: number
  cost: number
  price: number
}

export interface ServiceHistory extends BaseDocument {
  // Basic Info
  serviceNumber: string
  type: ServiceType
  status: ServiceStatus
  priority: Priority

  // Client & Equipment
  clientId: string
  clientName: string
  equipmentId: string
  equipmentName: string

  // Assignment
  technicianId: string
  technicianName: string

  // Timing
  scheduledDate?: Date
  startDate?: Date
  completedDate?: Date
  duration?: number // in minutes

  // Work Details
  problemDescription: string
  workPerformed: string
  rootCause?: string
  resolution?: string

  // Parts & Materials
  partsUsed?: PartUsed[]
  totalPartsCost?: number

  // Labor
  laborHours?: number
  laborRate?: number
  laborCost?: number

  // Costs
  totalCost?: number
  warrantyWork?: boolean

  // Quality
  testResults?: string
  calibrationData?: string

  // Follow-up
  followUpRequired?: boolean
  followUpDate?: Date
  followUpNotes?: string

  // Customer
  customerSignature?: string
  customerFeedback?: string
  customerRating?: number

  // Related Records
  appointmentId?: string
  invoiceId?: string
  harpInspectionId?: string

  // Files
  photos?: string[]
  documents?: string[]

  // Notes
  notes?: string
  internalNotes?: string
}

const PartUsedSchema = z.object({
  partId: z.string(),
  partName: z.string(),
  sku: z.string(),
  quantity: z.number().positive(),
  cost: z.number().nonnegative(),
  price: z.number().nonnegative()
})

export const ServiceHistorySchema = BaseDocumentSchema.extend({
  serviceNumber: z.string().min(1, 'Service number is required'),
  type: z.enum(['Repair', 'Maintenance', 'Installation', 'Inspection', 'Calibration', 'Upgrade', 'Emergency']),
  status: z.enum(['Scheduled', 'In Progress', 'Completed', 'Cancelled', 'On Hold']).default('Scheduled'),
  priority: PrioritySchema.default('Medium'),

  clientId: z.string().min(1, 'Client ID is required'),
  clientName: z.string().min(1, 'Client name is required'),
  equipmentId: z.string().min(1, 'Equipment ID is required'),
  equipmentName: z.string().min(1, 'Equipment name is required'),

  technicianId: z.string().min(1, 'Technician ID is required'),
  technicianName: z.string().min(1, 'Technician name is required'),

  scheduledDate: z.date().optional(),
  startDate: z.date().optional(),
  completedDate: z.date().optional(),
  duration: z.number().int().positive().optional(),

  problemDescription: z.string().min(1, 'Problem description is required'),
  workPerformed: z.string().min(1, 'Work performed is required'),
  rootCause: z.string().optional(),
  resolution: z.string().optional(),

  partsUsed: z.array(PartUsedSchema).optional(),
  totalPartsCost: z.number().nonnegative().optional(),

  laborHours: z.number().nonnegative().optional(),
  laborRate: z.number().nonnegative().optional(),
  laborCost: z.number().nonnegative().optional(),

  totalCost: z.number().nonnegative().optional(),
  warrantyWork: z.boolean().optional(),

  testResults: z.string().optional(),
  calibrationData: z.string().optional(),

  followUpRequired: z.boolean().optional(),
  followUpDate: z.date().optional(),
  followUpNotes: z.string().optional(),

  customerSignature: z.string().optional(),
  customerFeedback: z.string().optional(),
  customerRating: z.number().min(1).max(5).optional(),

  appointmentId: z.string().optional(),
  invoiceId: z.string().optional(),
  harpInspectionId: z.string().optional(),

  photos: z.array(z.string().url()).optional(),
  documents: z.array(z.string().url()).optional(),

  notes: z.string().optional(),
  internalNotes: z.string().optional()
})

export type CreateServiceHistoryInput = Omit<ServiceHistory, keyof BaseDocument>
export type UpdateServiceHistoryInput = Partial<Omit<ServiceHistory, 'id' | 'createdAt' | 'createdBy'>>
