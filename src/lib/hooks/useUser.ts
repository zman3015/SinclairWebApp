import { useState, useEffect, useCallback } from 'react'
import { User, UserRoleType } from '@/lib/models/user'
import { userService } from '@/lib/services/user.service'
import { useAuth } from '@/contexts/AuthContext'

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { user } = useAuth()

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await userService.getAllUsers()
      if (result.error) {
        setError(new Error(result.error.message))
      } else {
        setUsers(result.data || [])
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load users'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const updateUserRole = useCallback(async (userId: string, newRole: UserRoleType) => {
    try {
      const result = await userService.updateUserRole(userId, newRole, user?.uid)
      if (result.error) {
        throw new Error(result.error.message)
      }
      await loadUsers() // Refresh the list
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update user role')
    }
  }, [loadUsers, user])

  return {
    users,
    loading,
    error,
    refresh: loadUsers,
    updateUserRole
  }
}

export function useUser(userId: string | null) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!userId) {
      setUser(null)
      setLoading(false)
      return
    }

    const loadUser = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await userService.getById(userId)
        if (result.error) {
          setError(new Error(result.error.message))
        } else {
          setUser(result.data || null)
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load user'))
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [userId])

  return { user, loading, error }
}
