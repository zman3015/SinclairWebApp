import { BaseService, type ServiceResult, type QueryFilter } from './base'
import type { Notification } from '../models/notification'

class NotificationServiceClass extends BaseService<Notification> {
  constructor() {
    super('notifications')
  }

  /**
   * Get notifications by user ID
   */
  async getByUserId(userId: string): Promise<ServiceResult<Notification[]>> {
    const filters: QueryFilter[] = [
      { field: 'userId', operator: '==', value: userId }
    ]
    const result = await this.getAll(filters, { orderByField: 'createdAt', orderByDirection: 'desc' })
    if (result.error) {
      return { error: result.error }
    }
    return { data: result.data?.items || [] }
  }

  /**
   * Get unread notifications for a user
   */
  async getUnread(userId: string): Promise<ServiceResult<Notification[]>> {
    const filters: QueryFilter[] = [
      { field: 'userId', operator: '==', value: userId },
      { field: 'read', operator: '==', value: false }
    ]
    const result = await this.getAll(filters, { orderByField: 'createdAt', orderByDirection: 'desc' })
    if (result.error) {
      return { error: result.error }
    }
    return { data: result.data?.items || [] }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(id: string): Promise<ServiceResult<Notification>> {
    return this.update(id, {
      read: true,
      readAt: new Date()
    })
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<ServiceResult<void>> {
    const unreadResult = await this.getUnread(userId)
    if (unreadResult.error) {
      return { error: unreadResult.error }
    }

    const unread = unreadResult.data || []
    for (const notification of unread) {
      if (notification.id) {
        await this.markAsRead(notification.id)
      }
    }

    return { data: undefined }
  }

  /**
   * Dismiss notification
   */
  async dismiss(id: string): Promise<ServiceResult<Notification>> {
    return this.update(id, {
      dismissed: true,
      dismissedAt: new Date()
    })
  }

  /**
   * Get notifications by category
   */
  async getByCategory(category: string, userId?: string): Promise<ServiceResult<Notification[]>> {
    const filters: QueryFilter[] = [
      { field: 'category', operator: '==', value: category }
    ]

    if (userId) {
      filters.push({ field: 'userId', operator: '==', value: userId })
    }

    const result = await this.getAll(filters, { orderByField: 'createdAt', orderByDirection: 'desc' })
    if (result.error) {
      return { error: result.error }
    }
    return { data: result.data?.items || [] }
  }

  /**
   * Get active notifications (not expired)
   */
  async getActive(userId: string): Promise<ServiceResult<Notification[]>> {
    const result = await this.getByUserId(userId)
    if (result.error) {
      return { error: result.error }
    }

    const now = new Date()
    const filtered = (result.data || []).filter(notification =>
      !notification.dismissed &&
      (!notification.expiresAt || new Date(notification.expiresAt) > now)
    )

    return { data: filtered }
  }
}

export const NotificationService = new NotificationServiceClass()
