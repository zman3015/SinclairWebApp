import { useState, useEffect, useCallback } from 'react'
import { ClientService } from '../services/client.service'
import type { Client, CreateClientInput, UpdateClientInput } from '../models/client'
import type { AppError } from '../firebase/errors'

interface UseClientOptions {
  clientId?: string
  realtime?: boolean
}

interface UseClientResult {
  client: Client | null
  clients: Client[]
  loading: boolean
  error: AppError | null
  create: (data: CreateClientInput, userId?: string) => Promise<Client | null>
  update: (id: string, data: UpdateClientInput, userId?: string) => Promise<Client | null>
  remove: (id: string) => Promise<boolean>
  reload: () => Promise<void>
}

export function useClient(options?: UseClientOptions): UseClientResult {
  const [client, setClient] = useState<Client | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<AppError | null>(null)

  const loadClient = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    const result = await ClientService.getById(id)
    if (result.error) {
      setError(result.error)
      setClient(null)
    } else {
      setClient(result.data || null)
    }
    setLoading(false)
  }, [])

  const loadClients = useCallback(async () => {
    setLoading(true)
    setError(null)
    const result = await ClientService.getAll()
    if (result.error) {
      setError(result.error)
      setClients([])
    } else {
      setClients(result.data?.items || [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (options?.clientId) {
      if (options.realtime) {
        const unsubscribe = ClientService.subscribeToDoc(
          options.clientId,
          (data) => {
            setClient(data)
            setLoading(false)
          },
          (err) => {
            setError(err)
            setLoading(false)
          }
        )
        return () => unsubscribe()
      } else {
        loadClient(options.clientId)
      }
    } else {
      if (options?.realtime) {
        const unsubscribe = ClientService.subscribeToCollection(
          (data) => {
            setClients(data)
            setLoading(false)
          },
          (err) => {
            setError(err)
            setLoading(false)
          }
        )
        return () => unsubscribe()
      } else {
        loadClients()
      }
    }
  }, [options?.clientId, options?.realtime, loadClient, loadClients])

  const create = useCallback(async (data: CreateClientInput, userId?: string) => {
    setError(null)
    const result = await ClientService.create(data, userId)
    if (result.error) {
      setError(result.error)
      return null
    }
    if (!options?.realtime) {
      await loadClients()
    }
    return result.data || null
  }, [options?.realtime, loadClients])

  const update = useCallback(async (id: string, data: UpdateClientInput, userId?: string) => {
    setError(null)
    const result = await ClientService.update(id, data, userId)
    if (result.error) {
      setError(result.error)
      return null
    }
    if (!options?.realtime) {
      if (options?.clientId) {
        await loadClient(id)
      } else {
        await loadClients()
      }
    }
    return result.data || null
  }, [options?.realtime, options?.clientId, loadClient, loadClients])

  const remove = useCallback(async (id: string) => {
    setError(null)
    const result = await ClientService.delete(id)
    if (result.error) {
      setError(result.error)
      return false
    }
    if (!options?.realtime) {
      await loadClients()
    }
    return true
  }, [options?.realtime, loadClients])

  const reload = useCallback(async () => {
    if (options?.clientId) {
      await loadClient(options.clientId)
    } else {
      await loadClients()
    }
  }, [options?.clientId, loadClient, loadClients])

  return {
    client,
    clients,
    loading,
    error,
    create,
    update,
    remove,
    reload
  }
}

/**
 * Hook for fetching active clients
 */
export function useActiveClients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<AppError | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const result = await ClientService.getActive()
      if (result.error) {
        setError(result.error)
      } else {
        setClients(result.data || [])
      }
      setLoading(false)
    }
    load()
  }, [])

  return { clients, loading, error }
}

/**
 * Hook for searching clients
 */
export function useClientSearch(searchTerm: string) {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<AppError | null>(null)

  useEffect(() => {
    if (!searchTerm) {
      setClients([])
      return
    }

    const search = async () => {
      setLoading(true)
      const result = await ClientService.search(searchTerm)
      if (result.error) {
        setError(result.error)
      } else {
        setClients(result.data || [])
      }
      setLoading(false)
    }

    const debounce = setTimeout(search, 300)
    return () => clearTimeout(debounce)
  }, [searchTerm])

  return { clients, loading, error }
}

/**
 * Hook for paginated client list
 */
export function useClientsPaginated(limit = 10) {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<AppError | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [currentLimit, setCurrentLimit] = useState(limit)

  const loadClients = useCallback(async (newLimit?: number) => {
    setLoading(true)
    setError(null)
    const fetchLimit = newLimit || currentLimit
    const result = await ClientService.getAll(undefined, { limit: fetchLimit + 1 })

    if (result.error) {
      setError(result.error)
      setClients([])
      setHasMore(false)
    } else {
      const items = result.data?.items || []
      if (items.length > fetchLimit) {
        setClients(items.slice(0, fetchLimit))
        setHasMore(true)
      } else {
        setClients(items)
        setHasMore(false)
      }
    }
    setLoading(false)
  }, [currentLimit])

  useEffect(() => {
    loadClients()
  }, [loadClients])

  const loadMore = useCallback(() => {
    const newLimit = currentLimit + limit
    setCurrentLimit(newLimit)
    loadClients(newLimit)
  }, [currentLimit, limit, loadClients])

  const reload = useCallback(() => {
    loadClients()
  }, [loadClients])

  return {
    clients,
    loading,
    error,
    hasMore,
    loadMore,
    reload
  }
}
