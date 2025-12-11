"use client"

import { useState } from "react"
import Link from "next/link"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEquipment } from "@/lib/hooks/useEquipment"
import { Wrench, Search, Filter, Plus, AlertCircle } from "lucide-react"
import type { EquipmentType, EquipmentCondition } from "@/lib/models/equipment"

export default function EquipmentListPage() {
  const { equipmentList, loading, error } = useEquipment()
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<EquipmentType | "all">("all")
  const [conditionFilter, setConditionFilter] = useState<EquipmentCondition | "all">("all")

  // Filter equipment based on search and filters
  const filteredEquipment = equipmentList.filter(equipment => {
    const searchValue = (searchTerm ?? '').trim().toLowerCase()

    // If no search term, only apply type and condition filters
    const matchesSearch = !searchValue || (() => {
      // Safely collect searchable fields, ignoring undefined
      const searchableFields = [
        equipment.name,
        equipment.manufacturer,
        equipment.model,
        equipment.serialNumber,
        equipment.clientName,
      ]
        .filter(Boolean) // remove undefined/null
        .map((field) => field!.toString().toLowerCase())

      return searchableFields.some((field) => field.includes(searchValue))
    })()

    const matchesType = typeFilter === "all" || equipment.type === typeFilter
    const matchesCondition = conditionFilter === "all" || equipment.condition === conditionFilter

    return matchesSearch && matchesType && matchesCondition
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800'
      case 'Inactive':
        return 'bg-gray-100 text-gray-800'
      case 'Maintenance':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getConditionColor = (condition?: string) => {
    switch (condition) {
      case 'Excellent':
        return 'bg-green-100 text-green-800'
      case 'Good':
        return 'bg-blue-100 text-blue-800'
      case 'Fair':
        return 'bg-yellow-100 text-yellow-800'
      case 'Poor':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (error) {
    return (
      <MainLayout title="Equipment" subtitle="Manage dental equipment inventory">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error Loading Equipment</h3>
              <p className="text-gray-500 mb-4">{error.message}</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          </CardContent>
        </Card>
      </MainLayout>
    )
  }

  return (
    <MainLayout title="Equipment" subtitle="Manage dental equipment inventory">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1 w-full sm:max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search equipment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as EquipmentType | "all")}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Intraoral X-Ray">Intraoral X-Ray</SelectItem>
                <SelectItem value="Panoramic">Panoramic</SelectItem>
                <SelectItem value="Cephalometric">Cephalometric</SelectItem>
                <SelectItem value="CBCT">CBCT</SelectItem>
                <SelectItem value="Autoclave">Autoclave</SelectItem>
                <SelectItem value="Handpiece">Handpiece</SelectItem>
                <SelectItem value="Compressor">Compressor</SelectItem>
                <SelectItem value="Suction">Suction</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select value={conditionFilter} onValueChange={(value) => setConditionFilter(value as EquipmentCondition | "all")}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Conditions</SelectItem>
                <SelectItem value="Excellent">Excellent</SelectItem>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Fair">Fair</SelectItem>
                <SelectItem value="Poor">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Equipment Stats */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm font-medium text-gray-700">Total Equipment</div>
                <div className="text-2xl font-bold text-dental-blue">{equipmentList.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm font-medium text-gray-700">Active</div>
                <div className="text-2xl font-bold text-green-600">
                  {equipmentList.filter(e => e.status === 'Active').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm font-medium text-gray-700">Needs Service</div>
                <div className="text-2xl font-bold text-yellow-600">
                  {equipmentList.filter(e => {
                    if (!e.nextService) return false
                    const nextService = new Date(e.nextService)
                    const today = new Date()
                    const daysUntil = Math.floor((nextService.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                    return daysUntil <= 30 && daysUntil >= 0
                  }).length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm font-medium text-gray-700">Under Warranty</div>
                <div className="text-2xl font-bold text-blue-600">
                  {equipmentList.filter(e => {
                    if (!e.warrantyExpiry) return false
                    return new Date(e.warrantyExpiry) > new Date()
                  }).length}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Equipment List */}
        <Card>
          <CardHeader>
            <CardTitle>Equipment ({filteredEquipment.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <Skeleton className="h-5 w-64 mb-2" />
                        <Skeleton className="h-4 w-48" />
                      </div>
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredEquipment.length === 0 ? (
              <div className="text-center py-12">
                <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Equipment Found</h3>
                <p className="text-gray-500">
                  {searchTerm || typeFilter !== "all" || conditionFilter !== "all"
                    ? "Try adjusting your filters"
                    : "Get started by adding your first equipment"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEquipment.map((equipment) => (
                  <Link key={equipment.id} href={`/equipment/${equipment.id}`}>
                    <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            {equipment.manufacturer} {equipment.model}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {equipment.clientName} • SN: {equipment.serialNumber}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getStatusColor(equipment.status)}>
                            {equipment.status}
                          </Badge>
                          {equipment.condition && (
                            <Badge variant="outline" className={getConditionColor(equipment.condition)}>
                              {equipment.condition}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-700">Type</p>
                          <p>{equipment.type}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Last Service</p>
                          <p>{equipment.lastService ? new Date(equipment.lastService).toLocaleDateString() : 'N/A'}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Next Service</p>
                          <p className={equipment.nextService ? 'text-dental-blue font-medium' : ''}>
                            {equipment.nextService ? new Date(equipment.nextService).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Warranty</p>
                          <p>
                            {equipment.warrantyExpiry
                              ? new Date(equipment.warrantyExpiry) > new Date()
                                ? `Until ${new Date(equipment.warrantyExpiry).toLocaleDateString()}`
                                : 'Expired'
                              : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
