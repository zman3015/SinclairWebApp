import { useState, useEffect } from 'react'
import { InvoiceService } from '../services/invoice.service'
import { ScheduleService } from '../services/schedule.service'
import { ServiceHistoryService } from '../services/service-history.service'
import { PartService } from '../services/part.service'
import type { AppError } from '../firebase/errors'
import type { Invoice } from '../models/invoice'
import type { Schedule } from '../models/schedule'
import type { ServiceHistory } from '../models/service-history'

export interface DashboardStats {
  revenue: {
    monthToDate: number
    yearToDate: number
  }
  overdue: {
    count: number
    total: number
    invoices: Invoice[]
  }
  appointments: {
    upcoming: number
    today: number
  }
  parts: {
    lowStock: number
  }
}

export interface RecentActivity {
  id: string
  type: 'invoice' | 'appointment' | 'service'
  title: string
  subtitle: string
  date: Date
  status?: string
}

export interface MonthlyRevenue {
  month: string
  revenue: number
}

export interface ServiceBreakdown {
  type: string
  count: number
}

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    revenue: { monthToDate: 0, yearToDate: 0 },
    overdue: { count: 0, total: 0, invoices: [] },
    appointments: { upcoming: 0, today: 0 },
    parts: { lowStock: 0 }
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([])
  const [serviceBreakdown, setServiceBreakdown] = useState<ServiceBreakdown[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<AppError | null>(null)

  useEffect(() => {
    loadDashboardData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    setError(null)

    try {
      // Load all data in parallel
      const [
        mtdRevenue,
        ytdRevenue,
        overdueDetails,
        upcomingCount,
        todayCount,
        lowStockParts,
        recentInvoices,
        recentAppointments,
        recentServices,
        revenueTrend,
        serviceTypes
      ] = await Promise.all([
        InvoiceService.getMonthToDateRevenue(),
        InvoiceService.getYearToDateRevenue(),
        InvoiceService.getOverdueDetails(),
        ScheduleService.getUpcomingCount(7),
        ScheduleService.getTodayCount(),
        PartService.getLowStock(),
        InvoiceService.getAll(undefined, { limit: 5, orderByField: 'createdAt', orderByDirection: 'desc' }),
        ScheduleService.getUpcoming(7),
        ServiceHistoryService.getRecent(5),
        InvoiceService.getMonthlyRevenueTrend(12),
        ServiceHistoryService.getServiceBreakdown()
      ])

      // Set stats
      setStats({
        revenue: {
          monthToDate: mtdRevenue.data || 0,
          yearToDate: ytdRevenue.data || 0
        },
        overdue: {
          count: overdueDetails.data?.count || 0,
          total: overdueDetails.data?.total || 0,
          invoices: overdueDetails.data?.invoices || []
        },
        appointments: {
          upcoming: upcomingCount.data || 0,
          today: todayCount.data || 0
        },
        parts: {
          lowStock: lowStockParts.data?.length || 0
        }
      })

      // Combine recent activity
      const activity: RecentActivity[] = []

      // Add recent invoices
      const invoices = recentInvoices.data?.items || []
      invoices.forEach(inv => {
        activity.push({
          id: inv.id || '',
          type: 'invoice',
          title: `Invoice ${inv.invoiceNumber}`,
          subtitle: inv.clientName,
          date: inv.createdAt || new Date(),
          status: inv.status
        })
      })

      // Add recent appointments
      const appointments = recentAppointments.data || []
      appointments.forEach(apt => {
        activity.push({
          id: apt.id || '',
          type: 'appointment',
          title: apt.title,
          subtitle: apt.clientName,
          date: apt.startDate,
          status: apt.status
        })
      })

      // Add recent services
      const services = recentServices.data || []
      services.forEach(svc => {
        activity.push({
          id: svc.id || '',
          type: 'service',
          title: svc.type,
          subtitle: svc.equipmentName,
          date: svc.completedDate || svc.createdAt || new Date(),
          status: svc.status
        })
      })

      // Sort by date and take top 10
      activity.sort((a, b) => b.date.getTime() - a.date.getTime())
      setRecentActivity(activity.slice(0, 10))

      // Set chart data
      setMonthlyRevenue(revenueTrend.data || [])
      setServiceBreakdown(serviceTypes.data || [])

    } catch (err) {
      const error = err as AppError
      setError(error)
    } finally {
      setLoading(false)
    }
  }

  return {
    stats,
    recentActivity,
    monthlyRevenue,
    serviceBreakdown,
    loading,
    error,
    reload: loadDashboardData
  }
}
