import { z } from 'zod'
import { BaseDocument, BaseDocumentSchema } from './shared'

/**
 * Repair Model
 */

export type RepairStatus = 'Open' | 'In Progress' | 'Completed' | 'Cancelled'
export type RepairType = 'Routine Maintenance' | 'Emergency Repair' | 'Warranty Service' | 'Preventive' | 'Other'

export interface Repair extends BaseDocument {
  // Equipment reference
  equipmentId: string
  equipmentName?: string
  clientId: string
  clientName?: string

  // Repair details
  type: RepairType
  status: RepairStatus
  description: string
  workPerformed?: string

  // Parts
  partsUsed?: {
    partId?: string
    name: string
    quantity: number
    cost: number
  }[]

  // Costs
  laborCost?: number
  totalPartsCost?: number
  totalCost?: number

  // Personnel
  technicianId?: string
  technicianName?: string

  // Dates
  reportedDate: Date
  startDate?: Date
  completedDate?: Date

  // Additional
  photos?: string[]
  notes?: string
  priority?: 'Low' | 'Medium' | 'High' | 'Critical'
}

/**
 * Zod Schema for validation
 */
export const RepairSchema = BaseDocumentSchema.extend({
  equipmentId: z.string().min(1, 'Equipment ID is required'),
  equipmentName: z.string().optional(),
  clientId: z.string().min(1, 'Client ID is required'),
  clientName: z.string().optional(),

  type: z.enum(['Routine Maintenance', 'Emergency Repair', 'Warranty Service', 'Preventive', 'Other']),
  status: z.enum(['Open', 'In Progress', 'Completed', 'Cancelled']).default('Open'),
  description: z.string().min(1, 'Description is required'),
  workPerformed: z.string().optional(),

  partsUsed: z.array(z.object({
    partId: z.string().optional(),
    name: z.string(),
    quantity: z.number().positive(),
    cost: z.number().nonnegative()
  })).optional(),

  laborCost: z.number().nonnegative().optional(),
  totalPartsCost: z.number().nonnegative().optional(),
  totalCost: z.number().nonnegative().optional(),

  technicianId: z.string().optional(),
  technicianName: z.string().optional(),

  reportedDate: z.date(),
  startDate: z.date().optional(),
  completedDate: z.date().optional(),

  photos: z.array(z.string().url()).optional(),
  notes: z.string().optional(),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']).optional()
})

export type CreateRepairInput = Omit<Repair, keyof BaseDocument>
export type UpdateRepairInput = Partial<Omit<Repair, 'id' | 'createdAt' | 'createdBy'>>
