import { useState, useEffect, useCallback } from 'react'
import { InvoiceService } from '../services/invoice.service'
import type { Invoice, CreateInvoiceInput, UpdateInvoiceInput } from '../models/invoice'
import type { AppError } from '../firebase/errors'

export function useInvoices(clientId?: string) {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<AppError | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const result = clientId
        ? await InvoiceService.getByClientId(clientId)
        : await InvoiceService.getAll()

      if (result.error) {
        setError(result.error)
      } else {
        setInvoices(result.data?.items || result.data || [])
      }
      setLoading(false)
    }
    load()
  }, [clientId])

  const create = useCallback(async (data: CreateInvoiceInput, userId?: string) => {
    const result = await InvoiceService.create(data, userId)
    return result.data || null
  }, [])

  const update = useCallback(async (id: string, data: UpdateInvoiceInput, userId?: string) => {
    const result = await InvoiceService.update(id, data, userId)
    return result.data || null
  }, [])

  return { invoices, loading, error, create, update }
}
