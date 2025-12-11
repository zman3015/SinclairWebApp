import { z } from 'zod'
import { BaseDocument, BaseDocumentSchema } from './shared'

// User roles enum
export const UserRole = {
  ADMIN: 'admin',
  TECH: 'tech',
  VIEWER: 'viewer'
} as const

export type UserRoleType = typeof UserRole[keyof typeof UserRole]

// Zod schema for user
export const userSchema = BaseDocumentSchema.extend({
  email: z.string().email(),
  displayName: z.string().min(1),
  role: z.enum(['admin', 'tech', 'viewer']),
  companyName: z.string().optional(),
  phone: z.string().optional(),
})

export type User = z.infer<typeof userSchema> & BaseDocument

// Type for creating/updating users
export type CreateUserInput = Omit<User, keyof BaseDocument>
export type UpdateUserInput = Partial<CreateUserInput>
