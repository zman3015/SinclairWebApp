import { z } from 'zod'
import { BaseDocument, BaseDocumentSchema } from './shared'

/**
 * HARP X-Ray Inspection Model
 */

export type HarpTestType = 'HARP QA' | 'New Install' | 'Acceptance Test' | 'Plans Approved' | 'Replacement'
export type XrayType = 'Intra-oral' | 'Pan' | 'Ceph' | 'CT'
export type MsNiResult = 'MS' | 'NI'
export type YesNoResult = 'Yes' | 'No'
export type ImageType = 'Film' | 'Digital' | 'Phosphor Plate'
export type HarpStatus = 'Draft' | 'In Progress' | 'Completed' | 'Submitted' | 'Failed'

export interface HarpItemCheck {
  id: number
  label: string
  result: MsNiResult | null
}

export interface HarpTechniqueRow {
  id: string
  sourceToConeDistance: string
  setKv: string
  setMa: string
  setTime: string
  measuredKvp: string
  measuredTime: string
  outputMr: string
  peeAverageMr: string
}

export interface HarpHalfValueLayer {
  kV: string
  mA: string
  time: string
  totalFiltrationMmAl: string
  measuredHvlMm: string
  requiredHvlMm: string
  mR: string
}

export interface HarpInspection extends BaseDocument {
  // Status
  status: HarpStatus

  // Test Setup
  testType: HarpTestType | null
  xrayTypes: XrayType[]

  // Client & Location
  clientId: string
  clientName?: string
  clinicName: string
  clinicAddress: string
  clinicPhone: string
  accountNumber: string
  roomNumber: string

  // Dates
  inspectionDate: string
  technicianDate: string

  // Technician
  technicianId: string
  technicianName: string

  // Equipment Info
  equipmentId?: string
  equipmentMake: string
  equipmentModel: string
  controlSerial: string
  tubeSerial: string
  xrisNumber: string
  imageType: ImageType | null

  // Test Results
  items1to12: HarpItemCheck[]
  techniqueRows: HarpTechniqueRow[]
  items13to17: HarpItemCheck[]
  item18KvCheck: YesNoResult | null
  item19TimeCheck: YesNoResult | null
  item20HarpSpec: YesNoResult | null

  // Measurements
  peeKv: string
  peeMa: string
  peeSec: string
  beamAlignment: string
  halfValueLayer: HarpHalfValueLayer

  // Notes & Files
  notes: string
  pdfUrl?: string
  attachments?: string[]

  // Pass/Fail
  passed?: boolean
  failureReasons?: string[]
}

// Zod Schemas
const HarpItemCheckSchema = z.object({
  id: z.number(),
  label: z.string(),
  result: z.enum(['MS', 'NI']).nullable()
})

const HarpTechniqueRowSchema = z.object({
  id: z.string(),
  sourceToConeDistance: z.string(),
  setKv: z.string(),
  setMa: z.string(),
  setTime: z.string(),
  measuredKvp: z.string(),
  measuredTime: z.string(),
  outputMr: z.string(),
  peeAverageMr: z.string()
})

const HarpHalfValueLayerSchema = z.object({
  kV: z.string(),
  mA: z.string(),
  time: z.string(),
  totalFiltrationMmAl: z.string(),
  measuredHvlMm: z.string(),
  requiredHvlMm: z.string(),
  mR: z.string()
})

export const HarpInspectionSchema = BaseDocumentSchema.extend({
  status: z.enum(['Draft', 'In Progress', 'Completed', 'Submitted', 'Failed']).default('Draft'),

  testType: z.enum(['HARP QA', 'New Install', 'Acceptance Test', 'Plans Approved', 'Replacement']).nullable(),
  xrayTypes: z.array(z.enum(['Intra-oral', 'Pan', 'Ceph', 'CT'])),

  clientId: z.string().min(1, 'Client ID is required'),
  clientName: z.string().optional(),
  clinicName: z.string().min(1, 'Clinic name is required'),
  clinicAddress: z.string().min(1, 'Clinic address is required'),
  clinicPhone: z.string().min(1, 'Clinic phone is required'),
  accountNumber: z.string().min(1, 'Account number is required'),
  roomNumber: z.string(),

  inspectionDate: z.string(),
  technicianDate: z.string(),

  technicianId: z.string().min(1, 'Technician ID is required'),
  technicianName: z.string().min(1, 'Technician name is required'),

  equipmentId: z.string().optional(),
  equipmentMake: z.string().min(1, 'Equipment make is required'),
  equipmentModel: z.string().min(1, 'Equipment model is required'),
  controlSerial: z.string(),
  tubeSerial: z.string(),
  xrisNumber: z.string(),
  imageType: z.enum(['Film', 'Digital', 'Phosphor Plate']).nullable(),

  items1to12: z.array(HarpItemCheckSchema),
  techniqueRows: z.array(HarpTechniqueRowSchema),
  items13to17: z.array(HarpItemCheckSchema),
  item18KvCheck: z.enum(['Yes', 'No']).nullable(),
  item19TimeCheck: z.enum(['Yes', 'No']).nullable(),
  item20HarpSpec: z.enum(['Yes', 'No']).nullable(),

  peeKv: z.string(),
  peeMa: z.string(),
  peeSec: z.string(),
  beamAlignment: z.string(),
  halfValueLayer: HarpHalfValueLayerSchema,

  notes: z.string(),
  pdfUrl: z.string().url().optional(),
  attachments: z.array(z.string().url()).optional(),

  passed: z.boolean().optional(),
  failureReasons: z.array(z.string()).optional()
})

export type CreateHarpInspectionInput = Omit<HarpInspection, keyof BaseDocument>
export type UpdateHarpInspectionInput = Partial<Omit<HarpInspection, 'id' | 'createdAt' | 'createdBy'>>
