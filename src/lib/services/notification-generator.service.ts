import { NotificationService } from './notification.service'
import { InvoiceService } from './invoice.service'
import { ScheduleService } from './schedule.service'
import { CreateNotificationInput } from '../models/notification'
import { formatFirebaseError, logError } from '../firebase/errors'

/**
 * Notification Generator Service
 *
 * This service generates automated notifications based on business logic.
 * It's designed to be isolated so it can later become a scheduled Cloud Function.
 *
 * Current generators:
 * 1. Overdue invoices
 * 2. Upcoming appointments (within 24 hours)
 */
class NotificationGeneratorServiceClass {
  /**
   * Generate notifications for overdue invoices
   * Creates a notification for each unpaid invoice past its due date
   */
  async generateOverdueInvoiceNotifications(userId: string): Promise<number> {
    try {
      console.log('🔔 Generating overdue invoice notifications...')

      const invoicesResult = await InvoiceService.getAll()
      if (invoicesResult.error) {
        logError('NotificationGenerator.generateOverdueInvoiceNotifications', invoicesResult.error)
        return 0
      }

      const invoices = invoicesResult.data?.items || []
      const now = new Date()
      let generated = 0

      for (const invoice of invoices) {
        // Skip if already paid
        if (invoice.status === 'Paid') continue

        // Check if overdue
        if (invoice.dueDate && new Date(invoice.dueDate) < now) {
          const notification: CreateNotificationInput = {
            userId,
            title: `Overdue Invoice: ${invoice.invoiceNumber}`,
            body: `Invoice ${invoice.invoiceNumber} for ${invoice.clientName} is overdue. Amount: $${invoice.total.toFixed(2)}`,
            type: 'Warning',
            category: 'Invoice Due',
            priority: 'High',
            read: false,
            dismissed: false,
            relatedType: 'invoice',
            relatedId: invoice.id,
            actionUrl: `/invoices`,
            actionLabel: 'View Invoice'
          }

          const result = await NotificationService.create(notification, userId)
          if (!result.error) {
            generated++
          }
        }
      }

      console.log(`✅ Generated ${generated} overdue invoice notifications`)
      return generated
    } catch (error) {
      logError('NotificationGenerator.generateOverdueInvoiceNotifications', error)
      return 0
    }
  }

  /**
   * Generate notifications for upcoming appointments (within 24 hours)
   * Creates a notification for each appointment scheduled in the next 24 hours
   */
  async generateUpcomingAppointmentNotifications(userId: string): Promise<number> {
    try {
      console.log('🔔 Generating upcoming appointment notifications...')

      const schedulesResult = await ScheduleService.getAll()
      if (schedulesResult.error) {
        logError('NotificationGenerator.generateUpcomingAppointmentNotifications', schedulesResult.error)
        return 0
      }

      const schedules = schedulesResult.data?.items || []
      const now = new Date()
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
      let generated = 0

      for (const schedule of schedules) {
        // Skip completed or cancelled appointments
        if (schedule.status === 'Completed' || schedule.status === 'Cancelled') continue

        // Check if appointment is within next 24 hours
        const appointmentDate = new Date(schedule.startDate)
        if (appointmentDate > now && appointmentDate <= tomorrow) {
          const notification: CreateNotificationInput = {
            userId,
            title: `Upcoming Appointment: ${schedule.clientName}`,
            body: `You have an appointment with ${schedule.clientName} scheduled for ${appointmentDate.toLocaleString()}. Service: ${schedule.serviceType || schedule.type}`,
            type: 'Reminder',
            category: 'Appointment',
            priority: 'Medium',
            read: false,
            dismissed: false,
            relatedType: 'appointment',
            relatedId: schedule.id,
            actionUrl: `/schedule`,
            actionLabel: 'View Schedule',
            scheduledFor: appointmentDate
          }

          const result = await NotificationService.create(notification, userId)
          if (!result.error) {
            generated++
          }
        }
      }

      console.log(`✅ Generated ${generated} upcoming appointment notifications`)
      return generated
    } catch (error) {
      logError('NotificationGenerator.generateUpcomingAppointmentNotifications', error)
      return 0
    }
  }

  /**
   * Generate all notification types for a user
   * This is the main entry point that can be called by a scheduled function
   */
  async generateAllNotifications(userId: string): Promise<{ overdueInvoices: number; upcomingAppointments: number }> {
    console.log(`🔔 Generating all notifications for user ${userId}...`)

    const [overdueInvoices, upcomingAppointments] = await Promise.all([
      this.generateOverdueInvoiceNotifications(userId),
      this.generateUpcomingAppointmentNotifications(userId)
    ])

    console.log(`✅ Total notifications generated: ${overdueInvoices + upcomingAppointments}`)

    return {
      overdueInvoices,
      upcomingAppointments
    }
  }
}

export const NotificationGeneratorService = new NotificationGeneratorServiceClass()
