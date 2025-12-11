"use client"

import { use, useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Calendar,
  FileText,
  Package,
  Wrench,
  DollarSign,
  Clock,
  Star,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Navigation,
  Edit,
  Printer,
  Download,
  Users,
  Award,
  XCircle
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useClient } from "@/lib/hooks/useClient"
import { useEquipment } from "@/lib/hooks/useEquipment"
import { ServiceHistoryService } from "@/lib/services/service-history.service"
import { InvoiceService } from "@/lib/services/invoice.service"
import type { ServiceHistory } from "@/lib/models/service-history"
import type { Invoice } from "@/lib/models/invoice"
import type { AppError } from "@/lib/firebase/errors"

function DetailsSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Skeleton className="h-96 w-full" />
        </div>
        <div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    </div>
  )
}

export default function ClientProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  // Fetch client data
  const { client, loading: clientLoading, error: clientError, reload: reloadClient } = useClient({ clientId: id })

  // Fetch equipment for this client
  const { equipmentList, loading: equipmentLoading, error: equipmentError } = useEquipment({ clientId: id })

  // Fetch service history for this client
  const [serviceHistory, setServiceHistory] = useState<ServiceHistory[]>([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const [historyError, setHistoryError] = useState<AppError | null>(null)

  // Fetch invoices for this client
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [invoicesLoading, setInvoicesLoading] = useState(true)
  const [invoicesError, setInvoicesError] = useState<AppError | null>(null)

  useEffect(() => {
    const loadHistory = async () => {
      setHistoryLoading(true)
      const result = await ServiceHistoryService.getByClientId(id)
      if (result.error) {
        setHistoryError(result.error)
      } else {
        setServiceHistory(result.data || [])
      }
      setHistoryLoading(false)
    }
    loadHistory()
  }, [id])

  useEffect(() => {
    const loadInvoices = async () => {
      setInvoicesLoading(true)
      const result = await InvoiceService.getByClientId(id)
      if (result.error) {
        setInvoicesError(result.error)
      } else {
        setInvoices(result.data || [])
      }
      setInvoicesLoading(false)
    }
    loadInvoices()
  }, [id])

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800"
      case "Needs Attention": return "bg-yellow-100 text-yellow-800"
      case "Inactive": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getServiceTypeColor = (type: string) => {
    switch (type) {
      case "Routine Maintenance": return "bg-blue-100 text-blue-800"
      case "Preventive": return "bg-green-100 text-green-800"
      case "Repair": return "bg-yellow-100 text-yellow-800"
      case "Emergency": return "bg-red-100 text-red-800"
      case "Installation": return "bg-purple-100 text-purple-800"
      case "Inspection": return "bg-indigo-100 text-indigo-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getInvoiceStatusColor = (status: string) => {
    switch (status) {
      case "Paid": return "bg-green-100 text-green-800"
      case "Pending": return "bg-yellow-100 text-yellow-800"
      case "Overdue": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const formatAddress = (address?: string | { street?: string; city?: string; state?: string; zip?: string }) => {
    if (!address) return "N/A"
    if (typeof address === 'string') return address
    const parts = []
    if (address.street) parts.push(address.street)
    if (address.city) parts.push(address.city)
    if (address.state) parts.push(address.state)
    if (address.zip) parts.push(address.zip)
    return parts.join(', ') || "N/A"
  }

  const getCityState = (address?: string | { city?: string; state?: string; zip?: string }) => {
    if (!address) return "N/A"
    if (typeof address === 'string') {
      const parts = address.split(',')
      return parts.length > 1 ? parts.slice(-2).join(',').trim() : address
    }
    return `${address.city || ''}, ${address.state || ''} ${address.zip || ''}`.trim()
  }

  // Calculate stats
  const totalRevenue = invoices
    .filter(inv => inv.status === "Paid")
    .reduce((sum, inv) => sum + (inv.total || 0), 0)

  const avgTicket = invoices.length > 0 ? totalRevenue / invoices.length : 0

  // Error states
  if (clientError) {
    return (
      <MainLayout title="Client Details" subtitle="Loading...">
        <Card>
          <CardContent className="py-12 text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to load client</h3>
            <p className="text-gray-600 mb-4">{clientError.message}</p>
            <Button onClick={reloadClient}>Try Again</Button>
          </CardContent>
        </Card>
      </MainLayout>
    )
  }

  if (clientLoading || !client) {
    return (
      <MainLayout title="Loading..." subtitle="Please wait">
        <DetailsSkeleton />
      </MainLayout>
    )
  }

  return (
    <MainLayout
      title={client.name}
      subtitle={`${getCityState(client.address)} • ${client.territory || 'N/A'} Territory`}
    >
      <div className="space-y-6">
        {/* Quick Actions Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              <Button
                className="bg-dental-blue"
                onClick={() => router.push(`/schedule?clientId=${id}&clientName=${encodeURIComponent(client.name)}`)}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Visit
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push(`/invoices?clientId=${id}&clientName=${encodeURIComponent(client.name)}`)}
              >
                <FileText className="h-4 w-4 mr-2" />
                Create Invoice
              </Button>
              <Button variant="outline">
                <Wrench className="h-4 w-4 mr-2" />
                New Service
              </Button>
              {client.coordinates && (
                <Button
                  variant="outline"
                  onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${client.coordinates?.lat},${client.coordinates?.lng}`, '_blank')}
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Get Directions
                </Button>
              )}
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="outline">
                <Printer className="h-4 w-4 mr-2" />
                Print Summary
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs for different sections */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="equipment">Equipment</TabsTrigger>
                <TabsTrigger value="history">Service History</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Calendar className="h-8 w-8 mx-auto mb-2 text-dental-blue" />
                      <p className="text-2xl font-bold">{serviceHistory.length}</p>
                      <p className="text-xs text-gray-600">Total Visits</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Package className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <p className="text-2xl font-bold">{equipmentList.length}</p>
                      <p className="text-xs text-gray-600">Equipment</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <p className="text-2xl font-bold">${(totalRevenue / 1000).toFixed(1)}K</p>
                      <p className="text-xs text-gray-600">Total Revenue</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2 text-dental-blue" />
                      <p className="text-2xl font-bold">${avgTicket.toFixed(0)}</p>
                      <p className="text-xs text-gray-600">Avg Ticket</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {historyLoading ? (
                      <div className="space-y-3">
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                      </div>
                    ) : serviceHistory.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Wrench className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                        <p>No service history found</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {serviceHistory.slice(0, 3).map((service) => (
                          <div key={service.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 rounded-full bg-dental-blue/10 flex items-center justify-center">
                                <Wrench className="h-5 w-5 text-dental-blue" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <p className="font-semibold text-sm">{service.type || 'Service'}</p>
                                <Badge className={getServiceTypeColor(service.type || '')}>
                                  {service.status || 'Completed'}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">{service.problemDescription || service.workPerformed || 'No description'}</p>
                              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                <span>{service.completedDate ? new Date(service.completedDate).toLocaleDateString() : 'N/A'}</span>
                                <span>•</span>
                                <span>{service.technicianName || 'Unknown'}</span>
                                <span>•</span>
                                <span className="font-semibold text-green-600">${(service.laborCost || 0).toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Upcoming Services */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-dental-blue" />
                      Upcoming Services
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {equipmentLoading ? (
                      <div className="space-y-3">
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                      </div>
                    ) : equipmentList.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                        <p>No equipment registered</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {equipmentList.filter(eq => eq.status === "Active").slice(0, 3).map((equipment) => (
                          <div key={equipment.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium text-sm">{equipment.name}</p>
                              <p className="text-xs text-gray-500">
                                Next service: {equipment.nextService ? new Date(equipment.nextService).toLocaleDateString() : 'Not scheduled'}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => router.push(`/schedule?equipmentId=${equipment.id}`)}
                            >
                              <Calendar className="h-4 w-4 mr-1" />
                              Schedule
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Equipment Tab */}
              <TabsContent value="equipment" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Equipment Inventory ({equipmentList.length} items)</CardTitle>
                      <Button size="sm" className="bg-dental-blue">
                        <Package className="h-4 w-4 mr-2" />
                        Add Equipment
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {equipmentLoading ? (
                      <div className="space-y-3">
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-32 w-full" />
                      </div>
                    ) : equipmentError ? (
                      <div className="text-center py-8">
                        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
                        <p className="text-gray-600">{equipmentError.message}</p>
                      </div>
                    ) : equipmentList.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                        <p>No equipment registered</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {equipmentList.map((equipment) => (
                          <Card key={equipment.id}>
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h4 className="font-semibold">{equipment.name}</h4>
                                  <p className="text-sm text-gray-600">{equipment.manufacturer} {equipment.model}</p>
                                  <p className="text-xs text-gray-500">SN: {equipment.serialNumber}</p>
                                </div>
                                <Badge className={getStatusColor(equipment.status)}>
                                  {equipment.status}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                <div>
                                  <p className="text-xs text-gray-500">Location</p>
                                  <p className="font-medium">{equipment.location || 'N/A'}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Installed</p>
                                  <p className="font-medium">
                                    {equipment.installDate ? new Date(equipment.installDate).toLocaleDateString() : 'N/A'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Last Service</p>
                                  <p className="font-medium">
                                    {equipment.lastService ? new Date(equipment.lastService).toLocaleDateString() : 'N/A'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Warranty Expires</p>
                                  <p className="font-medium">
                                    {equipment.warrantyExpiry ? new Date(equipment.warrantyExpiry).toLocaleDateString() : 'N/A'}
                                  </p>
                                </div>
                              </div>

                              <div className="flex space-x-2 mt-3">
                                <Link href={`/equipment/${equipment.id}`}>
                                  <Button size="sm" variant="outline">
                                    <FileText className="h-3 w-3 mr-1" />
                                    Details
                                  </Button>
                                </Link>
                                <Button size="sm" variant="outline">
                                  <Wrench className="h-3 w-3 mr-1" />
                                  Service
                                </Button>
                                {equipment.qrCode && (
                                  <Link href={`/scanner?code=${equipment.qrCode}`}>
                                    <Button size="sm" variant="outline">
                                      View QR Code
                                    </Button>
                                  </Link>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Service History Tab */}
              <TabsContent value="history" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Complete Service History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {historyLoading ? (
                      <div className="space-y-3">
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-32 w-full" />
                      </div>
                    ) : historyError ? (
                      <div className="text-center py-8">
                        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
                        <p className="text-gray-600">{historyError.message}</p>
                      </div>
                    ) : serviceHistory.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Wrench className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                        <p>No service history found</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {serviceHistory.map((service) => (
                          <Card key={service.id}>
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <h4 className="font-semibold">{service.type || 'Service'}</h4>
                                    <Badge className={getServiceTypeColor(service.type || '')}>
                                      {service.status || 'Completed'}
                                    </Badge>
                                    <span className="text-sm text-gray-500">#{service.id}</span>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">{service.problemDescription || service.workPerformed || 'No description'}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-lg font-bold text-green-600">
                                    ${((service.laborCost || 0) + (service.totalPartsCost || 0)).toFixed(2)}
                                  </p>
                                  <p className="text-xs text-gray-500">{service.duration || 0} min</p>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm pt-3 border-t">
                                <div>
                                  <p className="text-xs text-gray-500">Date</p>
                                  <p className="font-medium">
                                    {service.completedDate ? new Date(service.completedDate).toLocaleDateString() : 'N/A'}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Technician</p>
                                  <p className="font-medium">{service.technicianName || 'Unknown'}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Parts Cost</p>
                                  <p className="font-medium">${(service.totalPartsCost || 0).toFixed(2)}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Labor Cost</p>
                                  <p className="font-medium">${(service.laborCost || 0).toFixed(2)}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Billing Tab */}
              <TabsContent value="billing" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Invoice History</CardTitle>
                      <Button
                        size="sm"
                        className="bg-dental-blue"
                        onClick={() => router.push(`/invoices?clientId=${id}&clientName=${encodeURIComponent(client.name)}`)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Create Invoice
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {invoicesLoading ? (
                      <div className="space-y-3">
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                      </div>
                    ) : invoicesError ? (
                      <div className="text-center py-8">
                        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
                        <p className="text-gray-600">{invoicesError.message}</p>
                      </div>
                    ) : invoices.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                        <p>No invoices found</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {invoices.map((invoice) => (
                          <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <p className="font-semibold">{invoice.invoiceNumber}</p>
                                <Badge className={getInvoiceStatusColor(invoice.status)}>
                                  {invoice.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">
                                Issued: {new Date(invoice.invoiceDate).toLocaleDateString()} •
                                Due: {new Date(invoice.dueDate).toLocaleDateString()}
                              </p>
                              {invoice.paidDate && (
                                <p className="text-xs text-green-600">
                                  Paid on {new Date(invoice.paidDate).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold">${invoice.total.toFixed(2)}</p>
                              <div className="flex space-x-1 mt-2">
                                <Link href={`/invoices/${invoice.id}`}>
                                  <Button size="sm" variant="outline">
                                    <FileText className="h-3 w-3" />
                                  </Button>
                                </Link>
                                <Button size="sm" variant="outline">
                                  <Download className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Printer className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Payment Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-gray-600 mb-1">Total Paid</p>
                      <p className="text-2xl font-bold text-dental-blue">${totalRevenue.toFixed(2)}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-gray-600 mb-1">Outstanding</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        ${invoices
                          .filter(i => i.status !== "Paid" && i.status !== "Cancelled")
                          .reduce((sum, i) => sum + i.total, 0)
                          .toFixed(2)}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-gray-600 mb-1">Total Invoices</p>
                      <p className="text-2xl font-bold text-green-600">{invoices.length}</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <MapPin className="h-4 w-4 mr-2" />
                    Address
                  </div>
                  <p className="text-sm font-medium ml-6">{formatAddress(client.address)}</p>
                </div>

                <Separator />

                <div>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <Phone className="h-4 w-4 mr-2" />
                    Phone
                  </div>
                  <p className="text-sm font-medium ml-6">{client.phone || 'N/A'}</p>
                </div>

                <Separator />

                <div>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </div>
                  <p className="text-sm font-medium ml-6">{client.email || 'N/A'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Contract Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contract Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <Badge className="bg-green-100 text-green-800 mt-1">
                    {client.contractStatus || 'Active'}
                  </Badge>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-gray-500">Territory</p>
                  <p className="text-sm font-medium">{client.territory || 'N/A'}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-gray-500">Account Number</p>
                  <p className="text-sm font-medium">{client.accountNumber}</p>
                </div>

                <Button className="w-full mt-4" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  View Contract
                </Button>
              </CardContent>
            </Card>

            {/* Loyalty & Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Loyalty & Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-gradient-to-br from-dental-blue/10 to-dental-yellow/10 rounded-lg">
                  <Star className="h-12 w-12 mx-auto mb-2 text-dental-blue" />
                  <p className="text-2xl font-bold text-dental-blue">{client.loyaltyTier || 'Bronze'}</p>
                  <p className="text-sm text-gray-600">Loyalty Tier</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold text-dental-blue">{serviceHistory.length}</p>
                    <p className="text-xs text-gray-600">Total Services</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold text-green-600">{equipmentList.length}</p>
                    <p className="text-xs text-gray-600">Equipment Units</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Last Service:</span>
                    <span className="font-medium">
                      {client.lastService ? new Date(client.lastService).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Next Scheduled:</span>
                    <span className="font-medium text-dental-blue">
                      {client.nextService ? new Date(client.nextService).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      {client.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            {client.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{client.notes}</p>
                  <Button className="w-full mt-4" variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Notes
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Back Button */}
        <div>
          <Link href="/accounts">
            <Button variant="outline">
              ← Back to Accounts
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  )
}
