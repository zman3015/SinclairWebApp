import { useState, useEffect, useCallback } from 'react'
import { NotificationService } from '../services/notification.service'
import type { Notification, CreateNotificationInput } from '../models/notification'
import type { AppError } from '../firebase/errors'
import { useAuth } from '@/contexts/AuthContext'

export function useNotifications(realtime = true) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<AppError | null>(null)

  useEffect(() => {
    if (!user?.uid) {
      setNotifications([])
      setUnreadCount(0)
      setLoading(false)
      return
    }

    if (realtime) {
      const unsubscribe = NotificationService.subscribeToCollection(
        (data) => {
          setNotifications(data)
          setUnreadCount(data.filter(n => !n.read).length)
          setLoading(false)
        },
        (err) => {
          setError(err)
          setLoading(false)
        },
        [{ field: 'userId', operator: '==', value: user.uid }]
      )
      return () => unsubscribe()
    } else {
      const load = async () => {
        setLoading(true)
        const result = await NotificationService.getByUserId(user.uid)
        if (result.error) {
          setError(result.error)
        } else {
          const data = result.data || []
          setNotifications(data)
          setUnreadCount(data.filter(n => !n.read).length)
        }
        setLoading(false)
      }
      load()
    }
  }, [user?.uid, realtime])

  const markAsRead = useCallback(async (id: string) => {
    const result = await NotificationService.markAsRead(id)
    return !result.error
  }, [])

  const markAllAsRead = useCallback(async () => {
    if (!user?.uid) return false
    const result = await NotificationService.markAllAsRead(user.uid)
    return !result.error
  }, [user?.uid])

  const dismiss = useCallback(async (id: string) => {
    const result = await NotificationService.dismiss(id)
    return !result.error
  }, [])

  const create = useCallback(async (data: CreateNotificationInput) => {
    const result = await NotificationService.create(data, user?.uid)
    return result.data || null
  }, [user?.uid])

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    dismiss,
    create
  }
}

export function useUnreadNotifications() {
  const { user } = useAuth()
  const [unread, setUnread] = useState<Notification[]>([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.uid) {
      setUnread([])
      setCount(0)
      setLoading(false)
      return
    }

    const unsubscribe = NotificationService.subscribeToCollection(
      (data) => {
        setUnread(data)
        setCount(data.length)
        setLoading(false)
      },
      () => setLoading(false),
      [
        { field: 'userId', operator: '==', value: user.uid },
        { field: 'read', operator: '==', value: false }
      ]
    )

    return () => unsubscribe()
  }, [user?.uid])

  return { unread, count, loading }
}
