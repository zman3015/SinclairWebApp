import { z } from 'zod'

/**
 * Shared base types and schemas
 */

export interface BaseDocument {
  id?: string
  createdAt?: Date
  updatedAt?: Date
  createdBy?: string
  updatedBy?: string
}

export const BaseDocumentSchema = z.object({
  id: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional()
})

/**
 * Common field schemas
 */
export const EmailSchema = z.string().email('Invalid email address')
export const PhoneSchema = z.string().regex(/^[\d\s\-\(\)\+]+$/, 'Invalid phone number')
export const URLSchema = z.string().url('Invalid URL')

/**
 * Location/Address types
 */
export interface Address {
  street?: string
  city?: string
  state?: string
  zip?: string
  country?: string
  full?: string
}

export const AddressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
  full: z.string().optional()
})

/**
 * Coordinates for map locations
 */
export interface Coordinates {
  lat: number
  lng: number
}

export const CoordinatesSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180)
})

/**
 * File/attachment types
 */
export interface Attachment {
  id: string
  name: string
  url: string
  type: string
  size: number
  uploadedAt: Date
  uploadedBy: string
}

export const AttachmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: URLSchema,
  type: z.string(),
  size: z.number().positive(),
  uploadedAt: z.date(),
  uploadedBy: z.string()
})

/**
 * Status types
 */
export type Status = 'Active' | 'Inactive' | 'Pending' | 'Suspended'
export const StatusSchema = z.enum(['Active', 'Inactive', 'Pending', 'Suspended'])

/**
 * Priority levels
 */
export type Priority = 'Low' | 'Medium' | 'High' | 'Critical'
export const PrioritySchema = z.enum(['Low', 'Medium', 'High', 'Critical'])
