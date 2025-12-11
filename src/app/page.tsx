"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DollarSign,
  Calendar,
  AlertTriangle,
  Package,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Loader2
} from "lucide-react"
import ProtectedRoute from "@/components/ProtectedRoute"
import { useAuth } from "@/contexts/AuthContext"
import { useDashboard } from "@/lib/hooks"
import { useUnreadNotifications } from "@/lib/hooks/useNotification"
import Link from "next/link"

// Loading skeleton component
function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16 mb-2" />
        <Skeleton className="h-3 w-32" />
      </CardContent>
    </Card>
  )
}

function ActivityItemSkeleton() {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border">
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="h-5 w-16" />
    </div>
  )
}

export default function Dashboard() {
  const { userData } = useAuth()
  const {
    stats,
    recentActivity,
    monthlyRevenue,
    serviceBreakdown,
    loading,
    error,
    reload
  } = useDashboard()
  const { count: unreadCount } = useUnreadNotifications()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'invoice':
        return FileText
      case 'appointment':
        return Calendar
      case 'service':
        return CheckCircle
      default:
        return Clock
    }
  }

  const getStatusColor = (status?: string) => {
    if (!status) return 'bg-gray-100 text-gray-800'
    switch (status.toLowerCase()) {
      case 'paid':
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800'
      case 'overdue':
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'in progress':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (error) {
    return (
      <ProtectedRoute>
        <MainLayout title="Dashboard" subtitle="Error loading dashboard">
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Failed to load dashboard</h3>
                <p className="text-gray-600 mb-4">{error.message}</p>
                <Button onClick={reload}>Try Again</Button>
              </div>
            </CardContent>
          </Card>
        </MainLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <MainLayout
        title="Dashboard"
        subtitle={`Welcome back, ${userData?.displayName || 'User'}! Here's your business overview.`}
      >
        <div className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {loading ? (
              <>
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
              </>
            ) : (
              <>
                {/* Month to Date Revenue */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">MTD Revenue</CardTitle>
                    <div className="p-2 rounded-md bg-green-500">
                      <DollarSign className="h-4 w-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(stats.revenue.monthToDate)}</div>
                    <p className="text-xs text-muted-foreground">
                      YTD: {formatCurrency(stats.revenue.yearToDate)}
                    </p>
                  </CardContent>
                </Card>

                {/* Upcoming Appointments */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Upcoming (7 days)</CardTitle>
                    <div className="p-2 rounded-md bg-dental-blue">
                      <Calendar className="h-4 w-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.appointments.upcoming}</div>
                    <p className="text-xs text-muted-foreground">
                      Today: {stats.appointments.today} appointments
                    </p>
                  </CardContent>
                </Card>

                {/* Overdue Invoices */}
                <Link href="/invoices">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Overdue Invoices</CardTitle>
                      <div className={`p-2 rounded-md ${stats.overdue.count > 0 ? 'bg-red-500' : 'bg-gray-400'}`}>
                        <AlertTriangle className="h-4 w-4 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.overdue.count}</div>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(stats.overdue.total)} outstanding
                      </p>
                    </CardContent>
                  </Card>
                </Link>

                {/* Low Stock Parts */}
                <Link href="/inventory">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Low Stock Parts</CardTitle>
                      <div className={`p-2 rounded-md ${stats.parts.lowStock > 0 ? 'bg-orange-500' : 'bg-gray-400'}`}>
                        <Package className="h-4 w-4 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.parts.lowStock}</div>
                      <p className="text-xs text-muted-foreground">
                        {stats.parts.lowStock > 0 ? 'Reorder needed' : 'All stocked'}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </>
            )}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-dental-blue" />
                  Monthly Revenue Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map(i => (
                      <Skeleton key={i} className="h-8 w-full" />
                    ))}
                  </div>
                ) : monthlyRevenue.length > 0 ? (
                  <div className="space-y-2">
                    {monthlyRevenue.slice(-6).map((item, index) => {
                      const maxRevenue = Math.max(...monthlyRevenue.map(m => m.revenue))
                      const widthPercent = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0

                      return (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">{formatMonth(item.month)}</span>
                            <span className="font-semibold text-dental-blue">{formatCurrency(item.revenue)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-dental-blue h-2 rounded-full transition-all"
                              style={{ width: `${widthPercent}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <TrendingUp className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>No revenue data yet</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Service Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-dental-blue" />
                  Service Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map(i => (
                      <Skeleton key={i} className="h-8 w-full" />
                    ))}
                  </div>
                ) : serviceBreakdown.length > 0 ? (
                  <div className="space-y-3">
                    {serviceBreakdown.map((item, index) => {
                      const total = serviceBreakdown.reduce((sum, s) => sum + s.count, 0)
                      const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0

                      const colors = [
                        'bg-dental-blue',
                        'bg-dental-yellow',
                        'bg-green-500',
                        'bg-orange-500',
                        'bg-purple-500',
                        'bg-pink-500'
                      ]
                      const color = colors[index % colors.length]

                      return (
                        <div key={index} className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium">{item.type}</span>
                              <span className="text-gray-600">{item.count} ({percentage}%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`${color} h-2 rounded-full transition-all`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>No service data yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-dental-blue" />
                  Recent Activity
                </span>
                {unreadCount > 0 && (
                  <Badge className="bg-red-500">
                    {unreadCount} new notifications
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map(i => (
                    <ActivityItemSkeleton key={i} />
                  ))}
                </div>
              ) : recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {recentActivity.map((activity) => {
                    const Icon = getActivityIcon(activity.type)

                    return (
                      <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="p-2 rounded-lg bg-dental-blue/10">
                            <Icon className="h-4 w-4 text-dental-blue" />
                          </div>
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm">{activity.title}</p>
                              {activity.status && (
                                <Badge className={getStatusColor(activity.status)}>
                                  {activity.status}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">{activity.subtitle}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">
                            {new Date(activity.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No recent activity</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Overdue Invoices Detail (if any) */}
          {!loading && stats.overdue.count > 0 && (
            <Card className="border-red-200 bg-red-50/50">
              <CardHeader>
                <CardTitle className="flex items-center text-red-700">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Attention: {stats.overdue.count} Overdue Invoice{stats.overdue.count !== 1 ? 's' : ''}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stats.overdue.invoices.slice(0, 5).map(invoice => (
                    <div key={invoice.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
                      <div>
                        <p className="font-medium text-sm">{invoice.invoiceNumber}</p>
                        <p className="text-xs text-gray-600">{invoice.clientName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-red-600">{formatCurrency(invoice.amountDue)}</p>
                        <p className="text-xs text-gray-500">
                          Due: {new Date(invoice.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {stats.overdue.count > 5 && (
                    <Link href="/invoices">
                      <Button variant="outline" className="w-full mt-2 border-red-300 text-red-700 hover:bg-red-100">
                        View All {stats.overdue.count} Overdue Invoices
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
