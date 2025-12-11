import { useState, useEffect, useCallback } from 'react'
import { HarpInspectionService } from '../services/harp-inspection.service'
import type { HarpInspection, CreateHarpInspectionInput, UpdateHarpInspectionInput } from '../models/harp-inspection'
import type { AppError } from '../firebase/errors'

export function useHarpInspections(clientId?: string) {
  const [inspections, setInspections] = useState<HarpInspection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<AppError | null>(null)

  const loadInspections = useCallback(async () => {
    setLoading(true)
    setError(null)

    const result = clientId
      ? await HarpInspectionService.getByClientId(clientId)
      : await HarpInspectionService.getAll([], { orderByField: 'inspectionDate', orderByDirection: 'desc' })

    if (result.error) {
      setError(result.error)
    } else {
      const data = result.data
      if (Array.isArray(data)) {
        setInspections(data)
      } else if (data && 'items' in data) {
        setInspections(data.items)
      } else {
        setInspections([])
      }
    }
    setLoading(false)
  }, [clientId])

  useEffect(() => {
    loadInspections()
  }, [loadInspections])

  const create = useCallback(async (data: CreateHarpInspectionInput, userId?: string) => {
    const result = await HarpInspectionService.create(data, userId)
    if (!result.error && result.data) {
      await loadInspections()
    }
    return result.data || null
  }, [loadInspections])

  const update = useCallback(async (id: string, data: UpdateHarpInspectionInput, userId?: string) => {
    const result = await HarpInspectionService.update(id, data, userId)
    if (!result.error && result.data) {
      await loadInspections()
    }
    return result.data || null
  }, [loadInspections])

  const regeneratePDF = useCallback(async (inspectionId: string) => {
    try {
      const result = await HarpInspectionService.getById(inspectionId)
      if (result.error || !result.data) {
        throw new Error('Inspection not found')
      }

      const inspection = result.data

      // Convert inspection data to form data format for PDF generation
      const formData = {
        testType: inspection.testType,
        xrayTypes: inspection.xrayTypes,
        clinicName: inspection.clinicName,
        clinicAddress: inspection.clinicAddress,
        clinicPhone: inspection.clinicPhone,
        accountNumber: inspection.accountNumber,
        roomNumber: inspection.roomNumber,
        inspectionDate: inspection.inspectionDate,
        technicianName: inspection.technicianName,
        technicianDate: inspection.technicianDate,
        equipmentMake: inspection.equipmentMake,
        equipmentModel: inspection.equipmentModel,
        controlSerial: inspection.controlSerial,
        tubeSerial: inspection.tubeSerial,
        xrisNumber: inspection.xrisNumber,
        imageType: inspection.imageType,
        items1to12: inspection.items1to12,
        techniqueRows: inspection.techniqueRows,
        items13to17: inspection.items13to17,
        item18KvCheck: inspection.item18KvCheck,
        item19TimeCheck: inspection.item19TimeCheck,
        item20HarpSpec: inspection.item20HarpSpec,
        peeKv: inspection.peeKv,
        peeMa: inspection.peeMa,
        peeSec: inspection.peeSec,
        beamAlignment: inspection.beamAlignment,
        halfValueLayer: inspection.halfValueLayer,
        notes: inspection.notes,
      }

      const response = await fetch("/api/harp-inspection/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to generate PDF")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `HARP-Inspection-${inspection.accountNumber}-${new Date(inspection.inspectionDate).toISOString().split('T')[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      return true
    } catch (error) {
      console.error("Error regenerating PDF:", error)
      return false
    }
  }, [])

  return { inspections, loading, error, create, update, regeneratePDF, refresh: loadInspections }
}
