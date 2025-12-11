import { z } from 'zod'
import { BaseDocument, BaseDocumentSchema, Priority, PrioritySchema } from './shared'

/**
 * Notification Model
 */

export type NotificationType = 'Info' | 'Warning' | 'Error' | 'Success' | 'Reminder'
export type NotificationCategory = 'Service Due' | 'Invoice Due' | 'Equipment Alert' | 'Appointment' | 'System' | 'General'

export interface Notification extends BaseDocument {
  // Basic Info
  title: string
  body: string
  type: NotificationType
  category: NotificationCategory
  priority: Priority

  // Recipient
  userId: string
  userEmail?: string

  // Status
  read: boolean
  readAt?: Date
  dismissed: boolean
  dismissedAt?: Date

  // Related Records
  relatedType?: string // 'client', 'equipment', 'invoice', 'appointment', etc.
  relatedId?: string

  // Action
  actionUrl?: string
  actionLabel?: string

  // Scheduling
  scheduledFor?: Date
  expiresAt?: Date

  // Metadata
  metadata?: Record<string, unknown>
}

export const NotificationSchema = BaseDocumentSchema.extend({
  title: z.string().min(1, 'Title is required'),
  body: z.string().min(1, 'Body is required'),
  type: z.enum(['Info', 'Warning', 'Error', 'Success', 'Reminder']).default('Info'),
  category: z.enum(['Service Due', 'Invoice Due', 'Equipment Alert', 'Appointment', 'System', 'General']).default('General'),
  priority: PrioritySchema.default('Medium'),

  userId: z.string().min(1, 'User ID is required'),
  userEmail: z.string().email().optional(),

  read: z.boolean().default(false),
  readAt: z.date().optional(),
  dismissed: z.boolean().default(false),
  dismissedAt: z.date().optional(),

  relatedType: z.string().optional(),
  relatedId: z.string().optional(),

  actionUrl: z.string().optional(),
  actionLabel: z.string().optional(),

  scheduledFor: z.date().optional(),
  expiresAt: z.date().optional(),

  metadata: z.record(z.string(), z.unknown()).optional()
})

export type CreateNotificationInput = Omit<Notification, keyof BaseDocument>
export type UpdateNotificationInput = Partial<Omit<Notification, 'id' | 'createdAt' | 'createdBy'>>
