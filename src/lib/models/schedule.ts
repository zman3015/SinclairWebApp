import { z } from 'zod'
import { BaseDocument, BaseDocumentSchema, Priority, PrioritySchema } from './shared'

/**
 * Schedule/Appointment Model
 */

export type AppointmentType = 'Service' | 'Installation' | 'Repair' | 'HARP Inspection' | 'Consultation' | 'Follow-up'
export type AppointmentStatus = 'Scheduled' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled' | 'No Show'

export interface Schedule extends BaseDocument {
  // Basic Info
  title: string
  type: AppointmentType
  status: AppointmentStatus
  priority: Priority

  // Timing
  startDate: Date
  endDate: Date
  duration: number // in minutes

  // Client & Equipment
  clientId: string
  clientName: string
  equipmentIds?: string[]

  // Assignment
  technicianId: string
  technicianName: string

  // Location
  location?: string
  address?: string

  // Service Details
  serviceType?: string
  description?: string
  partsNeeded?: string[]

  // Completion
  completedAt?: Date
  completionNotes?: string

  // Follow-up
  followUpRequired?: boolean
  followUpDate?: Date

  // Reminders
  reminderSent?: boolean
  reminderDate?: Date

  // Notes
  notes?: string
}

export const ScheduleSchema = BaseDocumentSchema.extend({
  title: z.string().min(1, 'Title is required'),
  type: z.enum(['Service', 'Installation', 'Repair', 'HARP Inspection', 'Consultation', 'Follow-up']),
  status: z.enum(['Scheduled', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'No Show']).default('Scheduled'),
  priority: PrioritySchema.default('Medium'),

  startDate: z.date(),
  endDate: z.date(),
  duration: z.number().int().positive('Duration must be positive'),

  clientId: z.string().min(1, 'Client ID is required'),
  clientName: z.string().min(1, 'Client name is required'),
  equipmentIds: z.array(z.string()).optional(),

  technicianId: z.string().min(1, 'Technician ID is required'),
  technicianName: z.string().min(1, 'Technician name is required'),

  location: z.string().optional(),
  address: z.string().optional(),

  serviceType: z.string().optional(),
  description: z.string().optional(),
  partsNeeded: z.array(z.string()).optional(),

  completedAt: z.date().optional(),
  completionNotes: z.string().optional(),

  followUpRequired: z.boolean().optional(),
  followUpDate: z.date().optional(),

  reminderSent: z.boolean().optional(),
  reminderDate: z.date().optional(),

  notes: z.string().optional()
})

export type CreateScheduleInput = Omit<Schedule, keyof BaseDocument>
export type UpdateScheduleInput = Partial<Omit<Schedule, 'id' | 'createdAt' | 'createdBy'>>
