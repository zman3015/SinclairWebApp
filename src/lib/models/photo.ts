import { z } from 'zod'
import { BaseDocument, BaseDocumentSchema } from './shared'

/**
 * Photo Model for Equipment and Repair Photos
 */

export interface Photo extends BaseDocument {
  // Reference
  equipmentId?: string
  repairId?: string

  // Storage
  storagePath: string
  downloadURL: string

  // Metadata
  fileName: string
  contentType: string
  size: number
  width?: number
  height?: number

  // Upload info
  uploadedAt: Date
  uploadedBy: string
  uploadedByName?: string

  // Optional
  caption?: string
  tags?: string[]
  isBeforePhoto?: boolean // For repair photos: true = before, false = after
}

export const PhotoSchema = BaseDocumentSchema.extend({
  equipmentId: z.string().optional(),
  repairId: z.string().optional(),

  storagePath: z.string().min(1, 'Storage path is required'),
  downloadURL: z.string().url('Invalid download URL'),

  fileName: z.string().min(1, 'File name is required'),
  contentType: z.string().min(1, 'Content type is required'),
  size: z.number().positive('Size must be positive'),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),

  uploadedAt: z.date(),
  uploadedBy: z.string().min(1, 'Uploaded by is required'),
  uploadedByName: z.string().optional(),

  caption: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isBeforePhoto: z.boolean().optional()
})

export type CreatePhotoInput = Omit<Photo, keyof BaseDocument>
export type UpdatePhotoInput = Partial<Omit<Photo, 'id' | 'createdAt' | 'createdBy' | 'uploadedAt' | 'uploadedBy'>>
