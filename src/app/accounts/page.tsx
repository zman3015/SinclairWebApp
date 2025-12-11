"use client"

import { useState, useMemo } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Building2,
  Search,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Star,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Loader2
} from "lucide-react"
import Link from "next/link"
import { useClientsPaginated } from "@/lib/hooks/useClient"

const territories = ["All", "North", "South", "East", "West", "Central"]

function ClientCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="grid grid-cols-4 gap-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Accounts() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTerritory, setSelectedTerritory] = useState("All")
  const [selectedLoyalty, setSelectedLoyalty] = useState("All")
  const [selectedContract, setSelectedContract] = useState("All")

  const { clients, loading, error, hasMore, loadMore, reload } = useClientsPaginated(20)

  // Helper to get city from address
  const getCity = (address?: string | { city?: string }) => {
    if (!address) return "N/A"
    if (typeof address === 'string') {
      const parts = address.split(',')
      return parts.length > 1 ? parts[parts.length - 2].trim() : "N/A"
    }
    return address.city || "N/A"
  }

  // Map loyalty tier to level
  const getLoyaltyLevel = (tier?: string) => {
    const map: Record<string, string> = {
      'Platinum': 'High',
      'Gold': 'High',
      'Silver': 'Medium',
      'Bronze': 'Low'
    }
    return tier ? map[tier] || 'Medium' : 'Medium'
  }

  // Filter clients
  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const matchesSearch =
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getCity(client.address).toLowerCase().includes(searchQuery.toLowerCase()) ||
        (client.email?.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesTerritory = selectedTerritory === "All" || client.territory === selectedTerritory
      const matchesLoyalty = selectedLoyalty === "All" || getLoyaltyLevel(client.loyaltyTier) === selectedLoyalty
      const matchesContract = selectedContract === "All" || client.contractStatus === selectedContract

      return matchesSearch && matchesTerritory && matchesLoyalty && matchesContract
    })
  }, [clients, searchQuery, selectedTerritory, selectedLoyalty, selectedContract])

  // Calculate stats
  const stats = useMemo(() => ({
    total: clients.length,
    activeContracts: clients.filter(c => c.contractStatus === "Active").length,
    highLoyalty: clients.filter(c => getLoyaltyLevel(c.loyaltyTier) === 'High').length,
    totalEquipment: clients.reduce((sum, c) => sum + (c.equipmentCount || 0), 0),
    territories: new Set(clients.map(c => c.territory).filter(Boolean)).size
  }), [clients])

  const getLoyaltyColor = (tier?: string) => {
    const level = getLoyaltyLevel(tier)
    if (level === 'High') return "bg-green-100 text-green-800"
    if (level === 'Medium') return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  const getContractColor = (status?: string) => {
    if (status === 'Active') return "bg-green-100 text-green-800"
    if (status === 'Pending' || status === 'Renewal Due') return "bg-yellow-100 text-yellow-800"
    if (status === 'Expired') return "bg-red-100 text-red-800"
    return "bg-gray-100 text-gray-800"
  }

  if (error) {
    return (
      <MainLayout title="Client Accounts" subtitle="Manage your clinic relationships">
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Failed to load accounts</h3>
              <p className="text-gray-600 mb-4">{error.message}</p>
              <Button onClick={reload}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      </MainLayout>
    )
  }

  return (
    <MainLayout title="Client Accounts" subtitle="Manage your clinic relationships and territories">
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-dental-blue" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Accounts</p>
                  <p className="text-2xl font-bold text-dental-blue">
                    {loading ? <Skeleton className="h-8 w-12" /> : stats.total}
                  </p>
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
                  <p className="text-2xl font-bold text-green-600">
                    {loading ? <Skeleton className="h-8 w-12" /> : stats.activeContracts}
                  </p>
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
                  <p className="text-2xl font-bold text-yellow-600">
                    {loading ? <Skeleton className="h-8 w-12" /> : stats.highLoyalty}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-dental-blue" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Equipment</p>
                  <p className="text-2xl font-bold text-dental-blue">
                    {loading ? <Skeleton className="h-8 w-12" /> : stats.totalEquipment}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Award className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Territories</p>
                  <p className="text-2xl font-bold text-green-600">
                    {loading ? <Skeleton className="h-8 w-12" /> : stats.territories}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, city, or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="w-full lg:w-48">
                <Select value={selectedTerritory} onValueChange={setSelectedTerritory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {territories.map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full lg:w-48">
                <Select value={selectedLoyalty} onValueChange={setSelectedLoyalty}>
                  <SelectTrigger><SelectValue placeholder="Loyalty Level" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Loyalty</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full lg:w-48">
                <Select value={selectedContract} onValueChange={setSelectedContract}>
                  <SelectTrigger><SelectValue placeholder="Contract Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Contracts</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Renewal Due">Renewal Due</SelectItem>
                    <SelectItem value="Expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="text-sm text-gray-600 mb-2">
          {loading ? (
            <Skeleton className="h-4 w-48" />
          ) : (
            `Showing ${filteredClients.length} of ${clients.length} accounts`
          )}
        </div>

        {/* Client List */}
        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            <>
              <ClientCardSkeleton />
              <ClientCardSkeleton />
              <ClientCardSkeleton />
            </>
          ) : filteredClients.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No accounts found</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {filteredClients.map((client) => (
                <Card key={client.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Building2 className="h-5 w-5 text-dental-blue" />
                          <Link href={`/accounts/${client.id}`}>
                            <h3 className="text-lg font-semibold text-gray-900 hover:text-dental-blue cursor-pointer">
                              {client.name}
                            </h3>
                          </Link>
                          <Badge className={getLoyaltyColor(client.loyaltyTier)}>
                            {getLoyaltyLevel(client.loyaltyTier)} Loyalty
                          </Badge>
                          {client.contractStatus && (
                            <Badge className={getContractColor(client.contractStatus)}>
                              {client.contractStatus}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{client.accountNumber}</p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-700">Territory</p>
                        <Badge variant="outline" className="mt-1">{client.territory || 'N/A'}</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Location</p>
                        <div className="flex items-center text-sm">
                          <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                          <span>{getCity(client.address)}</span>
                        </div>
                      </div>

                      {client.lastService && (
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">Last Service</p>
                          <div className="flex items-center text-sm">
                            <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                            <span>{new Date(client.lastService).toLocaleDateString()}</span>
                          </div>
                        </div>
                      )}

                      {client.equipmentCount !== undefined && (
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">Equipment</p>
                          <p className="text-sm font-semibold">{client.equipmentCount} units</p>
                        </div>
                      )}

                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Status</p>
                        <Badge variant="outline" className={
                          client.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-700'
                        }>
                          {client.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        {client.phone && (
                          <div className="flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            <span>{client.phone}</span>
                          </div>
                        )}
                        {client.email && (
                          <div className="flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            <span>{client.email}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        <Link href={`/accounts/${client.id}`}>
                          <Button size="sm" variant="outline">View Details</Button>
                        </Link>
                        <Button size="sm" className="bg-dental-blue">Schedule Visit</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Load More Button */}
              {hasMore && !loading && (
                <div className="flex justify-center pt-4">
                  <Button variant="outline" onClick={loadMore} className="w-full md:w-auto">
                    <Loader2 className="h-4 w-4 mr-2" />
                    Load More Accounts
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
