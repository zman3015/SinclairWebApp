import { z } from 'zod'
import { BaseDocument, BaseDocumentSchema, Status, StatusSchema, URLSchema } from './shared'

/**
 * Manual/Documentation Model
 */

export type ManualType = 'Service Manual' | 'User Guide' | 'Installation Guide' | 'Quick Reference' | 'Safety Guide' | 'Parts Catalog'

export interface Manual extends BaseDocument {
  // Basic Info
  title: string
  type: ManualType
  manufacturer: string
  model?: string

  // File Info - Storage
  storagePath: string // Path in Firebase Storage: manuals/{manufacturer}/{model}/{docId}.pdf
  downloadURL: string // Public download URL from Firebase Storage
  fileName: string
  fileSize: number // In bytes
  mimeType: string

  // Version
  version?: string
  revisionDate?: Date

  // Categorization
  category?: string
  tags?: string[]

  // Relationships
  equipmentIds?: string[]
  partIds?: string[]

  // Status
  status: Status

  // Additional Info
  description?: string
  notes?: string
  thumbnailUrl?: string

  // Usage & Metadata
  downloadCount?: number
  lastAccessed?: Date
  uploadedBy?: string
  uploadedAt: Date
}

export const ManualSchema = BaseDocumentSchema.extend({
  title: z.string().min(1, 'Title is required'),
  type: z.enum(['Service Manual', 'User Guide', 'Installation Guide', 'Quick Reference', 'Safety Guide', 'Parts Catalog']),
  manufacturer: z.string().min(1, 'Manufacturer is required'),
  model: z.string().optional(),

  storagePath: z.string().min(1, 'Storage path is required'),
  downloadURL: URLSchema,
  fileName: z.string().min(1, 'File name is required'),
  fileSize: z.number().positive('File size must be positive'),
  mimeType: z.string().min(1, 'MIME type is required'),

  version: z.string().optional(),
  revisionDate: z.date().optional(),

  category: z.string().optional(),
  tags: z.array(z.string()).optional(),

  equipmentIds: z.array(z.string()).optional(),
  partIds: z.array(z.string()).optional(),

  status: StatusSchema.default('Active'),

  description: z.string().optional(),
  notes: z.string().optional(),
  thumbnailUrl: URLSchema.optional(),

  downloadCount: z.number().int().nonnegative().optional(),
  lastAccessed: z.date().optional(),
  uploadedBy: z.string().optional(),
  uploadedAt: z.date()
})

export type CreateManualInput = Omit<Manual, keyof BaseDocument>
export type UpdateManualInput = Partial<Omit<Manual, 'id' | 'createdAt' | 'createdBy'>>
