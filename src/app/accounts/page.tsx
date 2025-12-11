"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Building2,
  Search,
  MapPin,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  TrendingDown,
  Clock,
  FileText,
  Star,
  Map,
  List,
  Award,
  AlertTriangle,
  CheckCircle,
  Route,
  Navigation,
  ExternalLink
} from "lucide-react"
import Link from "next/link"

// Sample clinic data with territories and loyalty metrics
const clinicsData = [
  {
    id: "CLI-001",
    name: "Bright Smiles Dental",
    address: "123 Main St, Downtown",
    city: "Portland",
    territory: "Northwest",
    phone: "(555) 123-4567",
    email: "contact@brightsmiles.com",
    contactPerson: "Dr. Sarah Johnson",
    contractStatus: "Active",
    contractExpiry: "2025-12-31",
    loyaltyLevel: "High",
    lastVisit: "2023-08-20",
    totalVisits: 47,
    monthlyVisits: 4,
    revenue: 12450.00,
    equipment: 8,
    openTickets: 1,
    coordinates: { lat: 45.5231, lng: -122.6765 }
  },
  {
    id: "CLI-002",
    name: "Family Dental Care",
    address: "456 Oak Ave, Midtown",
    city: "Portland",
    territory: "Northwest",
    phone: "(555) 234-5678",
    email: "info@familydentalcare.com",
    contactPerson: "Dr. Michael Chen",
    contractStatus: "Active",
    contractExpiry: "2024-06-30",
    loyaltyLevel: "High",
    lastVisit: "2023-08-19",
    totalVisits: 52,
    monthlyVisits: 5,
    revenue: 15800.00,
    equipment: 12,
    openTickets: 2,
    coordinates: { lat: 45.5155, lng: -122.6789 }
  },
  {
    id: "CLI-003",
    name: "Downtown Dentistry",
    address: "789 Pine St, Suite 200",
    city: "Portland",
    territory: "Northwest",
    phone: "(555) 345-6789",
    email: "admin@downtowndentistry.com",
    contactPerson: "Dr. Lisa Rodriguez",
    contractStatus: "Pending",
    contractExpiry: "2024-03-31",
    loyaltyLevel: "Medium",
    lastVisit: "2023-08-18",
    totalVisits: 23,
    monthlyVisits: 2,
    revenue: 6750.00,
    equipment: 5,
    openTickets: 0,
    coordinates: { lat: 45.5202, lng: -122.6742 }
  },
  {
    id: "CLI-004",
    name: "Care Dental Group",
    address: "321 Elm St, Uptown",
    city: "Seattle",
    territory: "Northwest",
    phone: "(555) 456-7890",
    email: "contact@caredentalgroup.com",
    contactPerson: "Dr. Robert Wilson",
    contractStatus: "Active",
    contractExpiry: "2025-09-30",
    loyaltyLevel: "High",
    lastVisit: "2023-08-15",
    totalVisits: 38,
    monthlyVisits: 3,
    revenue: 9850.00,
    equipment: 10,
    openTickets: 3,
    coordinates: { lat: 47.6062, lng: -122.3321 }
  },
  {
    id: "CLI-005",
    name: "Smile Center",
    address: "456 Maple Ave, Westside",
    city: "Eugene",
    territory: "Southwest",
    phone: "(555) 567-8901",
    email: "hello@smilecenter.com",
    contactPerson: "Dr. Emily Davis",
    contractStatus: "Active",
    contractExpiry: "2025-11-30",
    loyaltyLevel: "Medium",
    lastVisit: "2023-08-10",
    totalVisits: 18,
    monthlyVisits: 2,
    revenue: 5200.00,
    equipment: 6,
    openTickets: 1,
    coordinates: { lat: 44.0521, lng: -123.0868 }
  },
  {
    id: "CLI-006",
    name: "Modern Dentistry",
    address: "789 Birch Ave, Southside",
    city: "Salem",
    territory: "Southwest",
    phone: "(555) 678-9012",
    email: "info@moderndentistry.com",
    contactPerson: "Dr. Alex Parker",
    contractStatus: "Expired",
    contractExpiry: "2023-05-31",
    loyaltyLevel: "Low",
    lastVisit: "2023-06-05",
    totalVisits: 8,
    monthlyVisits: 0,
    revenue: 1850.00,
    equipment: 4,
    openTickets: 0,
    coordinates: { lat: 44.9429, lng: -123.0351 }
  },
  {
    id: "CLI-007",
    name: "Dental Excellence",
    address: "789 Oak St, Eastside",
    city: "Bend",
    territory: "Central",
    phone: "(555) 789-0123",
    email: "contact@dentalexcellence.com",
    contactPerson: "Dr. Mark Thompson",
    contractStatus: "Active",
    contractExpiry: "2026-01-31",
    loyaltyLevel: "High",
    lastVisit: "2023-08-17",
    totalVisits: 31,
    monthlyVisits: 3,
    revenue: 8900.00,
    equipment: 7,
    openTickets: 2,
    coordinates: { lat: 44.0582, lng: -121.3153 }
  },
  {
    id: "CLI-008",
    name: "Coastal Dental",
    address: "123 Beach Rd, Coastal",
    city: "Newport",
    territory: "Coastal",
    phone: "(555) 890-1234",
    email: "info@coastaldental.com",
    contactPerson: "Dr. Maria Santos",
    contractStatus: "Active",
    contractExpiry: "2025-08-31",
    loyaltyLevel: "Medium",
    lastVisit: "2023-08-12",
    totalVisits: 15,
    monthlyVisits: 1,
    revenue: 4100.00,
    equipment: 5,
    openTickets: 0,
    coordinates: { lat: 44.6369, lng: -124.0533 }
  },
  {
    id: "CLI-009",
    name: "Elite Dental Care",
    address: "456 Summit Ave, Heights",
    city: "Medford",
    territory: "Southwest",
    phone: "(555) 901-2345",
    email: "admin@elitedentalcare.com",
    contactPerson: "Dr. Kevin Chen",
    contractStatus: "Pending",
    contractExpiry: "2024-04-30",
    loyaltyLevel: "Low",
    lastVisit: "2023-07-28",
    totalVisits: 12,
    monthlyVisits: 1,
    revenue: 3200.00,
    equipment: 4,
    openTickets: 1,
    coordinates: { lat: 42.3265, lng: -122.8756 }
  },
  {
    id: "CLI-010",
    name: "Premier Dental",
    address: "555 Cedar St, Northside",
    city: "Portland",
    territory: "Northwest",
    phone: "(555) 111-2222",
    email: "contact@premierdental.com",
    contactPerson: "Dr. James Wilson",
    contractStatus: "Active",
    contractExpiry: "2025-10-31",
    loyaltyLevel: "High",
    lastVisit: "2023-08-21",
    totalVisits: 42,
    monthlyVisits: 4,
    revenue: 11200.00,
    equipment: 9,
    openTickets: 1,
    coordinates: { lat: 45.5395, lng: -122.6509 }
  }
]

const territories = ["All", "Northwest", "Southwest", "Central", "Coastal"]

export default function Accounts() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTerritory, setSelectedTerritory] = useState("All")
  const [selectedLoyalty, setSelectedLoyalty] = useState("All")
  const [selectedContract, setSelectedContract] = useState("All")
  const [viewMode, setViewMode] = useState<"list" | "map">("list")
  const [selectedClinics, setSelectedClinics] = useState<string[]>([])
  const [optimizedRoute, setOptimizedRoute] = useState<typeof clinicsData>([])
  const [showRouteDialog, setShowRouteDialog] = useState(false)

  // Toggle clinic selection for route planning
  const toggleClinicSelection = (clinicId: string) => {
    setSelectedClinics(prev =>
      prev.includes(clinicId)
        ? prev.filter(id => id !== clinicId)
        : [...prev, clinicId]
    )
  }

  // Calculate distance between two points (Haversine formula)
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 3959 // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  // Optimize route using nearest neighbor algorithm
  const optimizeRoute = () => {
    if (selectedClinics.length === 0) return

    const selectedClinicData = clinicsData.filter(c => selectedClinics.includes(c.id))

    // Use first selected clinic as starting point
    const route: typeof clinicsData = []
    const remaining = [...selectedClinicData]

    let current = remaining[0]
    route.push(current)
    remaining.splice(0, 1)

    while (remaining.length > 0) {
      let nearestIndex = 0
      let nearestDistance = Infinity

      remaining.forEach((clinic, index) => {
        const distance = calculateDistance(
          current.coordinates.lat,
          current.coordinates.lng,
          clinic.coordinates.lat,
          clinic.coordinates.lng
        )
        if (distance < nearestDistance) {
          nearestDistance = distance
          nearestIndex = index
        }
      })

      current = remaining[nearestIndex]
      route.push(current)
      remaining.splice(nearestIndex, 1)
    }

    setOptimizedRoute(route)
    setShowRouteDialog(true)
  }

  // Calculate total route distance
  const calculateTotalDistance = () => {
    if (optimizedRoute.length < 2) return 0
    let total = 0
    for (let i = 0; i < optimizedRoute.length - 1; i++) {
      total += calculateDistance(
        optimizedRoute[i].coordinates.lat,
        optimizedRoute[i].coordinates.lng,
        optimizedRoute[i + 1].coordinates.lat,
        optimizedRoute[i + 1].coordinates.lng
      )
    }
    return total
  }

  // Get Google Maps directions URL
  const getDirectionsUrl = (clinic: typeof clinicsData[0], fromCurrent = false) => {
    const destination = `${clinic.coordinates.lat},${clinic.coordinates.lng}`
    if (fromCurrent) {
      return `https://www.google.com/maps/dir/?api=1&destination=${destination}`
    }
    return `https://www.google.com/maps/search/?api=1&query=${destination}`
  }

  // Get multi-stop route URL
  const getMultiStopRouteUrl = () => {
    if (optimizedRoute.length === 0) return ""

    const origin = `${optimizedRoute[0].coordinates.lat},${optimizedRoute[0].coordinates.lng}`
    const destination = `${optimizedRoute[optimizedRoute.length - 1].coordinates.lat},${optimizedRoute[optimizedRoute.length - 1].coordinates.lng}`

    const waypoints = optimizedRoute
      .slice(1, -1)
      .map(c => `${c.coordinates.lat},${c.coordinates.lng}`)
      .join('|')

    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypoints ? `&waypoints=${waypoints}` : ''}`
  }

  // Filter clinics
  const filteredClinics = clinicsData.filter(clinic => {
    const matchesSearch = clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clinic.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clinic.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTerritory = selectedTerritory === "All" || clinic.territory === selectedTerritory
    const matchesLoyalty = selectedLoyalty === "All" || clinic.loyaltyLevel === selectedLoyalty
    const matchesContract = selectedContract === "All" || clinic.contractStatus === selectedContract

    return matchesSearch && matchesTerritory && matchesLoyalty && matchesContract
  })

  // Calculate stats
  const stats = {
    total: clinicsData.length,
    activeContracts: clinicsData.filter(c => c.contractStatus === "Active").length,
    highLoyalty: clinicsData.filter(c => c.loyaltyLevel === "High").length,
    mediumLoyalty: clinicsData.filter(c => c.loyaltyLevel === "Medium").length,
    lowLoyalty: clinicsData.filter(c => c.loyaltyLevel === "Low").length,
    totalRevenue: clinicsData.reduce((sum, c) => sum + c.revenue, 0),
    avgVisits: (clinicsData.reduce((sum, c) => sum + c.totalVisits, 0) / clinicsData.length).toFixed(1)
  }

  const getLoyaltyColor = (level: string) => {
    switch (level) {
      case "High": return "bg-green-100 text-green-800"
      case "Medium": return "bg-yellow-100 text-yellow-800"
      case "Low": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getLoyaltyIcon = (level: string) => {
    switch (level) {
      case "High": return Star
      case "Medium": return TrendingUp
      case "Low": return TrendingDown
      default: return Clock
    }
  }

  const getContractColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800"
      case "Pending": return "bg-yellow-100 text-yellow-800"
      case "Expired": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getContractIcon = (status: string) => {
    switch (status) {
      case "Active": return CheckCircle
      case "Pending": return Clock
      case "Expired": return AlertTriangle
      default: return FileText
    }
  }

  return (
    <MainLayout
      title="Client Accounts"
      subtitle="Manage your clinic relationships and territories"
    >
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-dental-blue" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Accounts</p>
                  <p className="text-2xl font-bold text-dental-blue">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Contracts</p>
                  <p className="text-2xl font-bold text-green-600">{stats.activeContracts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">High Loyalty</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.highLoyalty}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-dental-blue" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Visits</p>
                  <p className="text-2xl font-bold text-dental-blue">{stats.avgVisits}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Award className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">${(stats.totalRevenue / 1000).toFixed(0)}K</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Route Planning Tools */}
        {selectedClinics.length > 0 && (
          <Card className="border-dental-blue">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Route className="h-5 w-5 text-dental-blue" />
                  <div>
                    <p className="font-semibold">Route Planning</p>
                    <p className="text-sm text-gray-600">{selectedClinics.length} clinic{selectedClinics.length > 1 ? 's' : ''} selected</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setSelectedClinics([])}>
                    Clear Selection
                  </Button>
                  <Button className="bg-dental-blue" onClick={optimizeRoute}>
                    <Route className="h-4 w-4 mr-2" />
                    Optimize Route
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters and View Toggle */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, city, or contact..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Territory Filter */}
              <div className="w-full lg:w-48">
                <Select value={selectedTerritory} onValueChange={setSelectedTerritory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {territories.map(territory => (
                      <SelectItem key={territory} value={territory}>{territory}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Loyalty Filter */}
              <div className="w-full lg:w-48">
                <Select value={selectedLoyalty} onValueChange={setSelectedLoyalty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Loyalty Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Loyalty</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Contract Filter */}
              <div className="w-full lg:w-48">
                <Select value={selectedContract} onValueChange={setSelectedContract}>
                  <SelectTrigger>
                    <SelectValue placeholder="Contract Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Contracts</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* View Toggle */}
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-dental-blue" : ""}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "map" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("map")}
                  className={viewMode === "map" ? "bg-dental-blue" : ""}
                >
                  <Map className="h-4 w-4" />
                </Button>
              </div>

              {/* Route Planning Toggle */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="route-mode"
                  checked={selectedClinics.length > 0}
                  onChange={() => selectedClinics.length > 0 ? setSelectedClinics([]) : null}
                  className="h-4 w-4 text-dental-blue rounded"
                />
                <label htmlFor="route-mode" className="text-sm font-medium">
                  Route Planning Mode
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="text-sm text-gray-600 mb-2">
          Showing {filteredClinics.length} of {clinicsData.length} accounts
        </div>

        {viewMode === "list" ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredClinics.map((clinic) => {
              const LoyaltyIcon = getLoyaltyIcon(clinic.loyaltyLevel)
              const ContractIcon = getContractIcon(clinic.contractStatus)
              const isSelected = selectedClinics.includes(clinic.id)

              return (
                <Card key={clinic.id} className={`hover:shadow-lg transition-shadow ${isSelected ? 'ring-2 ring-dental-blue' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Selection Checkbox */}
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleClinicSelection(clinic.id)}
                        className="mt-1 h-5 w-5 text-dental-blue rounded"
                      />

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <Building2 className="h-5 w-5 text-dental-blue" />
                              <Link href={`/accounts/${clinic.id}`}>
                                <h3 className="text-lg font-semibold text-gray-900 hover:text-dental-blue cursor-pointer">
                                  {clinic.name}
                                </h3>
                              </Link>
                              <Badge className={getLoyaltyColor(clinic.loyaltyLevel)}>
                                <LoyaltyIcon className="h-3 w-3 mr-1" />
                                {clinic.loyaltyLevel} Loyalty
                              </Badge>
                              <Badge className={getContractColor(clinic.contractStatus)}>
                                <ContractIcon className="h-3 w-3 mr-1" />
                                {clinic.contractStatus}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{clinic.contactPerson}</p>
                          </div>

                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-700">Territory</p>
                            <Badge variant="outline" className="mt-1">{clinic.territory}</Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-1">Location</p>
                            <div className="flex items-center text-sm">
                              <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                              <span>{clinic.city}</span>
                            </div>
                          </div>

                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-1">Last Visit</p>
                            <div className="flex items-center text-sm">
                              <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                              <span>{clinic.lastVisit}</span>
                            </div>
                          </div>

                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-1">Total Visits</p>
                            <p className="text-sm font-semibold text-dental-blue">{clinic.totalVisits}</p>
                          </div>

                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-1">Monthly Visits</p>
                            <p className="text-sm font-semibold">{clinic.monthlyVisits}/mo</p>
                          </div>

                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-1">Revenue (YTD)</p>
                            <p className="text-sm font-semibold text-green-600">${clinic.revenue.toLocaleString()}</p>
                          </div>

                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-1">Equipment</p>
                            <p className="text-sm font-semibold">{clinic.equipment} units</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              <span>{clinic.phone}</span>
                            </div>
                            <div className="flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              <span>{clinic.email}</span>
                            </div>
                            {clinic.openTickets > 0 && (
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                                {clinic.openTickets} Open Ticket{clinic.openTickets > 1 ? 's' : ''}
                              </Badge>
                            )}
                          </div>

                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(getDirectionsUrl(clinic, true), '_blank')}
                            >
                              <Navigation className="h-4 w-4 mr-1" />
                              Directions
                            </Button>
                            <Link href={`/accounts/${clinic.id}`}>
                              <Button size="sm" variant="outline">View Details</Button>
                            </Link>
                            <Button size="sm" className="bg-dental-blue">Schedule Visit</Button>
                          </div>
                        </div>

                        {clinic.contractStatus === "Active" && (
                          <div className="mt-4 pt-4 border-t">
                            <div className="flex items-center justify-between text-xs text-gray-600">
                              <span>Contract expires: {clinic.contractExpiry}</span>
                              <span className="text-dental-blue font-medium">View Contract →</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6">
              <div className="bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 h-[600px] flex items-center justify-center relative overflow-hidden">
                {/* Map Container */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
                  {/* Simulated Map Grid */}
                  <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-10">
                    {Array.from({ length: 144 }).map((_, i) => (
                      <div key={i} className="border border-gray-400"></div>
                    ))}
                  </div>

                  {/* Map Markers for filtered clinics */}
                  <div className="relative h-full w-full">
                    {filteredClinics.map((clinic, index) => {
                      // Position markers based on coordinates (simplified positioning)
                      const normalizedLat = ((clinic.coordinates.lat - 42) / (48 - 42)) * 100
                      const normalizedLng = ((clinic.coordinates.lng + 125) / (-121 + 125)) * 100

                      const top = `${100 - normalizedLat}%`
                      const left = `${normalizedLng}%`

                      const LoyaltyIcon = getLoyaltyIcon(clinic.loyaltyLevel)

                      return (
                        <div
                          key={clinic.id}
                          className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                          style={{ top, left }}
                        >
                          {/* Marker Pin */}
                          <div className={`relative ${
                            clinic.loyaltyLevel === "High" ? "text-green-600" :
                              clinic.loyaltyLevel === "Medium" ? "text-yellow-600" :
                                "text-red-600"
                          }`}>
                            <MapPin className="h-8 w-8 drop-shadow-lg" fill="currentColor" />
                            <LoyaltyIcon className="h-3 w-3 absolute top-1 left-1/2 transform -translate-x-1/2 text-white" />
                          </div>

                          {/* Tooltip on Hover */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                            <div className="bg-white border-2 border-dental-blue rounded-lg shadow-xl p-3 w-64">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-sm">{clinic.name}</h4>
                                <Badge className={getLoyaltyColor(clinic.loyaltyLevel)}>
                                  {clinic.loyaltyLevel}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-600 mb-1">{clinic.city}, {clinic.territory}</p>
                              <p className="text-xs text-gray-600 mb-2">{clinic.contactPerson}</p>
                              <div className="border-t pt-2 space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span className="text-gray-600">Total Visits:</span>
                                  <span className="font-semibold">{clinic.totalVisits}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span className="text-gray-600">Revenue:</span>
                                  <span className="font-semibold text-green-600">${clinic.revenue.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span className="text-gray-600">Contract:</span>
                                  <Badge className={getContractColor(clinic.contractStatus)}>
                                    {clinic.contractStatus}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Map Legend */}
                  <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 border">
                    <h4 className="font-semibold text-sm mb-3">Loyalty Levels</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-5 w-5 text-green-600" fill="currentColor" />
                        <span className="text-xs">High Loyalty</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-5 w-5 text-yellow-600" fill="currentColor" />
                        <span className="text-xs">Medium Loyalty</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-5 w-5 text-red-600" fill="currentColor" />
                        <span className="text-xs">Low Loyalty</span>
                      </div>
                    </div>
                  </div>

                  {/* Territory Labels */}
                  <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 border">
                    <h4 className="font-semibold text-sm mb-2">Territories</h4>
                    <div className="space-y-1 text-xs">
                      {territories.filter(t => t !== "All").map(territory => {
                        const count = filteredClinics.filter(c => c.territory === territory).length
                        return (
                          <div key={territory} className="flex justify-between space-x-4">
                            <span className="text-gray-600">{territory}:</span>
                            <span className="font-semibold">{count}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Info Text */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-0 pointer-events-none">
                  <Map className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-400 font-medium">Hover over markers for clinic details</p>
                  <p className="text-sm text-gray-400 mt-1">Showing {filteredClinics.length} accounts on map</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Route Optimization Dialog */}
        <Dialog open={showRouteDialog} onOpenChange={setShowRouteDialog}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Optimized Route Plan</DialogTitle>
              <DialogDescription>
                Visit {optimizedRoute.length} clinics in the most efficient order
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Route Summary */}
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-600">Total Stops</p>
                      <p className="text-2xl font-bold text-dental-blue">{optimizedRoute.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Distance</p>
                      <p className="text-2xl font-bold text-dental-blue">{calculateTotalDistance().toFixed(1)} mi</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Est. Drive Time</p>
                      <p className="text-2xl font-bold text-dental-blue">{(calculateTotalDistance() / 30 * 60).toFixed(0)} min</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Route Steps */}
              <div className="max-h-[400px] overflow-y-auto space-y-3">
                {optimizedRoute.map((clinic, index) => (
                  <Card key={clinic.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-dental-blue text-white flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{clinic.name}</h4>
                          <p className="text-sm text-gray-600">{clinic.address}</p>
                          <p className="text-sm text-gray-500">{clinic.city}, {clinic.territory}</p>
                          {index < optimizedRoute.length - 1 && (
                            <p className="text-xs text-dental-blue mt-1">
                              → {calculateDistance(
                                clinic.coordinates.lat,
                                clinic.coordinates.lng,
                                optimizedRoute[index + 1].coordinates.lat,
                                optimizedRoute[index + 1].coordinates.lng
                              ).toFixed(1)} miles to next stop
                            </p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(getDirectionsUrl(clinic, true), '_blank')}
                        >
                          <Navigation className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Button
                  className="flex-1 bg-dental-blue"
                  onClick={() => window.open(getMultiStopRouteUrl(), '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in Google Maps
                </Button>
                <Button variant="outline" onClick={() => setShowRouteDialog(false)}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  )
}
