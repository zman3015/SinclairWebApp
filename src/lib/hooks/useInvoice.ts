import { useState, useEffect, useCallback } from 'react'
import { InvoiceService } from '../services/invoice.service'
import type { Invoice, CreateInvoiceInput, UpdateInvoiceInput } from '../models/invoice'
import type { AppError } from '../firebase/errors'
import { useAuth } from '@/contexts/AuthContext'

export function useInvoices(clientId?: string) {
  const { user } = useAuth()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<AppError | null>(null)
  const [saving, setSaving] = useState(false)

  const loadInvoices = useCallback(async () => {
    setLoading(true)
    setError(null)
    const result = clientId
      ? await InvoiceService.getByClientId(clientId)
      : await InvoiceService.getAll()

    if (result.error) {
      setError(result.error)
      setInvoices([])
    } else if (result.data) {
      // Handle both array and paginated result
      const items = Array.isArray(result.data) ? result.data : result.data.items
      setInvoices(items || [])
    }
    setLoading(false)
  }, [clientId])

  useEffect(() => {
    loadInvoices()
  }, [loadInvoices])

  const create = useCallback(async (data: Omit<CreateInvoiceInput, 'invoiceNumber'>) => {
    setSaving(true)
    setError(null)
    const result = await InvoiceService.createWithNumber(data, user?.uid)
    setSaving(false)

    if (result.error) {
      setError(result.error)
      return null
    }

    await loadInvoices()
    return result.data || null
  }, [user?.uid, loadInvoices])

  const update = useCallback(async (id: string, data: UpdateInvoiceInput) => {
    setSaving(true)
    setError(null)
    const result = await InvoiceService.update(id, data, user?.uid)
    setSaving(false)

    if (result.error) {
      setError(result.error)
      return null
    }

    await loadInvoices()
    return result.data || null
  }, [user?.uid, loadInvoices])

  const markAsPaid = useCallback(async (
    id: string,
    paymentMethod: string,
    paymentReference?: string
  ) => {
    setSaving(true)
    setError(null)
    const result = await InvoiceService.markAsPaid(id, paymentMethod, paymentReference, user?.uid)
    setSaving(false)

    if (result.error) {
      setError(result.error)
      return null
    }

    await loadInvoices()
    return result.data || null
  }, [user?.uid, loadInvoices])

  const remove = useCallback(async (id: string) => {
    setSaving(true)
    setError(null)
    const result = await InvoiceService.delete(id)
    setSaving(false)

    if (result.error) {
      setError(result.error)
      return false
    }

    await loadInvoices()
    return true
  }, [loadInvoices])

  return {
    invoices,
    loading,
    error,
    saving,
    create,
    update,
    markAsPaid,
    remove,
    reload: loadInvoices
  }
}

export function useInvoiceSummary() {
  const [stats, setStats] = useState({
    totalOutstanding: 0,
    paidThisMonth: 0,
    pending: 0,
    overdue: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const result = await InvoiceService.getSummaryStats()
      if (!result.error && result.data) {
        setStats(result.data)
      }
      setLoading(false)
    }
    load()
  }, [])

  return { stats, loading }
}
