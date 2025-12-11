"use client"

import { use } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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
  Award
} from "lucide-react"
import Link from "next/link"

// Sample clinic data (same as accounts page - in production would fetch from DB)
const clinicsData = [
  {
    id: "CLI-001",
    name: "Bright Smiles Dental",
    address: "123 Main St, Downtown",
    city: "Portland",
    state: "OR",
    zip: "97201",
    territory: "Northwest",
    phone: "(555) 123-4567",
    email: "contact@brightsmiles.com",
    website: "www.brightsmiles.com",
    contactPerson: "Dr. Sarah Johnson",
    contactTitle: "Practice Owner",
    secondaryContact: "Jennifer Smith",
    secondaryTitle: "Office Manager",
    secondaryPhone: "(555) 123-4568",
    contractStatus: "Active",
    contractStart: "2023-01-01",
    contractExpiry: "2025-12-31",
    contractType: "Full Service Agreement",
    billingCycle: "Monthly",
    paymentTerms: "Net 30",
    loyaltyLevel: "High",
    lastVisit: "2023-08-20",
    nextScheduled: "2023-09-05",
    totalVisits: 47,
    monthlyVisits: 4,
    revenue: 12450.00,
    ytdRevenue: 8900.00,
    avgTicket: 265.00,
    equipment: 8,
    openTickets: 1,
    coordinates: { lat: 45.5231, lng: -122.6765 },
    notes: "Priority client. Prefers morning appointments. Has emergency contact number.",
    taxId: "XX-XXXXXXX"
  },
  // Add other clinics as needed...
]

// Sample equipment data for the clinic
const clinicEquipment = [
  {
    id: "EQ-001",
    name: "A-Dec 500 Chair #1",
    type: "Dental Chair",
    manufacturer: "A-Dec",
    model: "500",
    serialNumber: "AS500-2023-001",
    installDate: "2023-01-15",
    warrantyExpiry: "2025-01-15",
    lastService: "2023-08-20",
    nextService: "2023-11-20",
    status: "Active",
    location: "Room 1"
  },
  {
    id: "EQ-002",
    name: "A-Dec 500 Chair #2",
    type: "Dental Chair",
    manufacturer: "A-Dec",
    model: "500",
    serialNumber: "AS500-2023-002",
    installDate: "2023-01-15",
    warrantyExpiry: "2025-01-15",
    lastService: "2023-08-20",
    nextService: "2023-11-20",
    status: "Active",
    location: "Room 2"
  },
  {
    id: "EQ-003",
    name: "Planmeca X-Ray Unit",
    type: "X-Ray Equipment",
    manufacturer: "Planmeca",
    model: "ProMax 3D",
    serialNumber: "PM-XR-2023-001",
    installDate: "2023-02-01",
    warrantyExpiry: "2025-02-01",
    lastService: "2023-07-15",
    nextService: "2024-01-15",
    status: "Active",
    location: "X-Ray Room"
  },
  {
    id: "EQ-004",
    name: "Dentsply Handpiece Set",
    type: "Handpieces",
    manufacturer: "Dentsply",
    model: "Midwest Tradition",
    serialNumber: "DH-2023-001",
    installDate: "2023-01-20",
    warrantyExpiry: "2024-01-20",
    lastService: "2023-08-10",
    nextService: "2023-11-10",
    status: "Needs Attention",
    location: "Operatory 1"
  },
  {
    id: "EQ-005",
    name: "Belmont Suction System",
    type: "Suction",
    manufacturer: "Belmont",
    model: "Clesta II",
    serialNumber: "BS-2023-001",
    installDate: "2023-01-10",
    warrantyExpiry: "2025-01-10",
    lastService: "2023-07-20",
    nextService: "2023-10-20",
    status: "Active",
    location: "Central"
  }
]

// Sample service history
const serviceHistory = [
  {
    id: "SRV-145",
    date: "2023-08-20",
    type: "Routine Maintenance",
    equipment: ["A-Dec 500 Chair #1", "A-Dec 500 Chair #2"],
    technician: "John Doe",
    duration: 120,
    cost: 245.00,
    status: "Completed",
    description: "Annual preventive maintenance on both chairs",
    partsUsed: ["Seal Kit", "Lubricant"],
    nextService: "2024-08-20"
  },
  {
    id: "SRV-138",
    date: "2023-08-10",
    type: "Repair",
    equipment: ["Dentsply Handpiece Set"],
    technician: "John Doe",
    duration: 45,
    cost: 125.00,
    status: "Completed",
    description: "Replaced bearings in high-speed handpiece",
    partsUsed: ["Bearing Set"],
    nextService: "2023-11-10"
  },
  {
    id: "SRV-125",
    date: "2023-07-20",
    type: "Preventive",
    equipment: ["Belmont Suction System"],
    technician: "John Doe",
    duration: 60,
    cost: 95.00,
    status: "Completed",
    description: "Filter replacement and system check",
    partsUsed: ["Suction Filter"],
    nextService: "2023-10-20"
  },
  {
    id: "SRV-112",
    date: "2023-07-15",
    type: "Inspection",
    equipment: ["Planmeca X-Ray Unit"],
    technician: "Sarah Smith",
    duration: 90,
    cost: 175.00,
    status: "Completed",
    description: "Semi-annual calibration and safety inspection",
    partsUsed: [],
    nextService: "2024-01-15"
  },
  {
    id: "SRV-098",
    date: "2023-06-15",
    type: "Emergency",
    equipment: ["A-Dec 500 Chair #1"],
    technician: "John Doe",
    duration: 180,
    cost: 485.00,
    status: "Completed",
    description: "Hydraulic pump failure - replaced pump assembly",
    partsUsed: ["Hydraulic Pump Assembly", "Hydraulic Fluid"],
    nextService: "2023-09-15"
  }
]

// Sample invoices
const invoices = [
  {
    id: "INV-2023-087",
    date: "2023-08-20",
    dueDate: "2023-09-19",
    amount: 245.00,
    status: "Paid",
    paidDate: "2023-08-25",
    services: ["SRV-145"]
  },
  {
    id: "INV-2023-084",
    date: "2023-08-10",
    dueDate: "2023-09-09",
    amount: 125.00,
    status: "Paid",
    paidDate: "2023-08-15",
    services: ["SRV-138"]
  },
  {
    id: "INV-2023-078",
    date: "2023-07-20",
    dueDate: "2023-08-19",
    amount: 95.00,
    status: "Paid",
    paidDate: "2023-07-28",
    services: ["SRV-125"]
  },
  {
    id: "INV-2023-075",
    date: "2023-07-15",
    dueDate: "2023-08-14",
    amount: 175.00,
    status: "Pending",
    paidDate: null,
    services: ["SRV-112"]
  }
]

export default function ClientProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  // In production, fetch clinic data by ID
  const clinic = clinicsData[0] // Using first clinic as example

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

  return (
    <MainLayout
      title={clinic.name}
      subtitle={`${clinic.city}, ${clinic.state} • ${clinic.territory} Territory`}
    >
      <div className="space-y-6">
        {/* Quick Actions Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              <Button className="bg-dental-blue">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Visit
              </Button>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Create Invoice
              </Button>
              <Button variant="outline">
                <Wrench className="h-4 w-4 mr-2" />
                New Service
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${clinic.coordinates.lat},${clinic.coordinates.lng}`, '_blank')}
              >
                <Navigation className="h-4 w-4 mr-2" />
                Get Directions
              </Button>
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
                      <p className="text-2xl font-bold">{clinic.totalVisits}</p>
                      <p className="text-xs text-gray-600">Total Visits</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Package className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <p className="text-2xl font-bold">{clinic.equipment}</p>
                      <p className="text-xs text-gray-600">Equipment</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <p className="text-2xl font-bold">${(clinic.ytdRevenue / 1000).toFixed(1)}K</p>
                      <p className="text-xs text-gray-600">YTD Revenue</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2 text-dental-blue" />
                      <p className="text-2xl font-bold">${clinic.avgTicket.toFixed(0)}</p>
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
                              <p className="font-semibold text-sm">{service.type}</p>
                              <Badge className={getServiceTypeColor(service.type)}>
                                {service.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{service.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              <span>{service.date}</span>
                              <span>•</span>
                              <span>{service.technician}</span>
                              <span>•</span>
                              <span className="font-semibold text-green-600">${service.cost.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
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
                    <div className="space-y-3">
                      {clinicEquipment.filter(eq => eq.status === "Active").slice(0, 3).map((equipment) => (
                        <div key={equipment.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{equipment.name}</p>
                            <p className="text-xs text-gray-500">Next service: {equipment.nextService}</p>
                          </div>
                          <Button size="sm" variant="outline">
                            <Calendar className="h-4 w-4 mr-1" />
                            Schedule
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Equipment Tab */}
              <TabsContent value="equipment" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Equipment Inventory ({clinicEquipment.length} items)</CardTitle>
                      <Button size="sm" className="bg-dental-blue">
                        <Package className="h-4 w-4 mr-2" />
                        Add Equipment
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {clinicEquipment.map((equipment) => (
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
                                <p className="font-medium">{equipment.location}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Installed</p>
                                <p className="font-medium">{equipment.installDate}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Last Service</p>
                                <p className="font-medium">{equipment.lastService}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Warranty Expires</p>
                                <p className="font-medium">{equipment.warrantyExpiry}</p>
                              </div>
                            </div>

                            <div className="flex space-x-2 mt-3">
                              <Button size="sm" variant="outline">
                                <FileText className="h-3 w-3 mr-1" />
                                History
                              </Button>
                              <Button size="sm" variant="outline">
                                <Wrench className="h-3 w-3 mr-1" />
                                Service
                              </Button>
                              <Link href={`/scanner?code=${equipment.serialNumber}`}>
                                <Button size="sm" variant="outline">
                                  View QR Code
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
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
                    <div className="space-y-3">
                      {serviceHistory.map((service) => (
                        <Card key={service.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h4 className="font-semibold">{service.type}</h4>
                                  <Badge className={getServiceTypeColor(service.type)}>
                                    {service.status}
                                  </Badge>
                                  <span className="text-sm text-gray-500">#{service.id}</span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {service.equipment.map((eq, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {eq}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-green-600">${service.cost.toFixed(2)}</p>
                                <p className="text-xs text-gray-500">{service.duration} min</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm pt-3 border-t">
                              <div>
                                <p className="text-xs text-gray-500">Date</p>
                                <p className="font-medium">{service.date}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Technician</p>
                                <p className="font-medium">{service.technician}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Parts Used</p>
                                <p className="font-medium">{service.partsUsed.length || 'None'}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Next Service</p>
                                <p className="font-medium">{service.nextService}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Billing Tab */}
              <TabsContent value="billing" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Invoice History</CardTitle>
                      <Button size="sm" className="bg-dental-blue">
                        <FileText className="h-4 w-4 mr-2" />
                        Create Invoice
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {invoices.map((invoice) => (
                        <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <p className="font-semibold">{invoice.id}</p>
                              <Badge className={getInvoiceStatusColor(invoice.status)}>
                                {invoice.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              Issued: {invoice.date} • Due: {invoice.dueDate}
                            </p>
                            {invoice.paidDate && (
                              <p className="text-xs text-green-600">Paid on {invoice.paidDate}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold">${invoice.amount.toFixed(2)}</p>
                            <div className="flex space-x-1 mt-2">
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
                  </CardContent>
                </Card>

                {/* Payment Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-gray-600 mb-1">Total Billed (YTD)</p>
                      <p className="text-2xl font-bold text-dental-blue">${clinic.ytdRevenue.toFixed(2)}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-gray-600 mb-1">Outstanding</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        ${invoices.filter(i => i.status === "Pending").reduce((sum, i) => sum + i.amount, 0).toFixed(2)}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-gray-600 mb-1">Average Payment Time</p>
                      <p className="text-2xl font-bold text-green-600">8 days</p>
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
                  <p className="text-sm font-medium ml-6">{clinic.address}</p>
                  <p className="text-sm font-medium ml-6">{clinic.city}, {clinic.state} {clinic.zip}</p>
                </div>

                <Separator />

                <div>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <Phone className="h-4 w-4 mr-2" />
                    Phone
                  </div>
                  <p className="text-sm font-medium ml-6">{clinic.phone}</p>
                </div>

                <Separator />

                <div>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </div>
                  <p className="text-sm font-medium ml-6">{clinic.email}</p>
                </div>

                <Separator />

                <div>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <Users className="h-4 w-4 mr-2" />
                    Primary Contact
                  </div>
                  <p className="text-sm font-medium ml-6">{clinic.contactPerson}</p>
                  <p className="text-xs text-gray-500 ml-6">{clinic.contactTitle}</p>
                </div>

                <Separator />

                <div>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <Users className="h-4 w-4 mr-2" />
                    Secondary Contact
                  </div>
                  <p className="text-sm font-medium ml-6">{clinic.secondaryContact}</p>
                  <p className="text-xs text-gray-500 ml-6">{clinic.secondaryTitle}</p>
                  <p className="text-xs text-gray-500 ml-6">{clinic.secondaryPhone}</p>
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
                  <p className="text-xs text-gray-500">Contract Type</p>
                  <p className="text-sm font-medium">{clinic.contractType}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <Badge className="bg-green-100 text-green-800 mt-1">
                    {clinic.contractStatus}
                  </Badge>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-gray-500">Start Date</p>
                  <p className="text-sm font-medium">{clinic.contractStart}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-gray-500">Expiry Date</p>
                  <p className="text-sm font-medium">{clinic.contractExpiry}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-gray-500">Billing Cycle</p>
                  <p className="text-sm font-medium">{clinic.billingCycle}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-gray-500">Payment Terms</p>
                  <p className="text-sm font-medium">{clinic.paymentTerms}</p>
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
                  <p className="text-2xl font-bold text-dental-blue">{clinic.loyaltyLevel}</p>
                  <p className="text-sm text-gray-600">Loyalty Level</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold text-dental-blue">{clinic.monthlyVisits}</p>
                    <p className="text-xs text-gray-600">Visits/Month</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold text-green-600">94%</p>
                    <p className="text-xs text-gray-600">On-Time Payment</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Last Visit:</span>
                    <span className="font-medium">{clinic.lastVisit}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Next Scheduled:</span>
                    <span className="font-medium text-dental-blue">{clinic.nextScheduled}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Open Tickets:</span>
                    <Badge variant={clinic.openTickets > 0 ? "destructive" : "secondary"}>
                      {clinic.openTickets}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{clinic.notes}</p>
                <Button className="w-full mt-4" variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Notes
                </Button>
              </CardContent>
            </Card>
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
