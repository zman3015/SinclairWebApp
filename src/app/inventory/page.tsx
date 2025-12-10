"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Package,
  Search,
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle,
  ShoppingCart,
  Filter,
  Download
} from "lucide-react"

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Sample inventory data
  const inventoryItems = [
    {
      id: "INV-001",
      sku: "AD-500-HP-001",
      name: "A-Dec 500 Hydraulic Pump Assembly",
      category: "Hydraulic Parts",
      brand: "A-Dec",
      currentStock: 2,
      minStock: 1,
      maxStock: 5,
      unitCost: 385.00,
      supplier: "A-Dec Direct",
      location: "Van - Section A",
      lastUsed: "2023-08-15",
      status: "In Stock"
    },
    {
      id: "INV-002",
      sku: "AD-500-CP-002",
      name: "Control Panel Assembly",
      category: "Electronics",
      brand: "A-Dec",
      currentStock: 0,
      minStock: 1,
      maxStock: 3,
      unitCost: 275.00,
      supplier: "A-Dec Direct",
      location: "Van - Section B",
      lastUsed: "2023-08-18",
      status: "Out of Stock"
    },
    {
      id: "INV-003",
      sku: "PL-XR-FLT-003",
      name: "X-Ray Filter Set",
      category: "Consumables",
      brand: "Planmeca",
      currentStock: 15,
      minStock: 5,
      maxStock: 20,
      unitCost: 12.50,
      supplier: "Patterson Dental",
      location: "Van - Section C",
      lastUsed: "2023-08-10",
      status: "In Stock"
    },
    {
      id: "INV-004",
      sku: "DS-HP-REP-004",
      name: "Handpiece Repair Kit",
      category: "Tools",
      brand: "Dentsply",
      currentStock: 1,
      minStock: 2,
      maxStock: 4,
      unitCost: 89.00,
      supplier: "Henry Schein",
      location: "Van - Section D",
      lastUsed: "2023-08-12",
      status: "Low Stock"
    },
    {
      id: "INV-005",
      sku: "GEN-LUB-001",
      name: "General Purpose Lubricant",
      category: "Consumables",
      brand: "Generic",
      currentStock: 8,
      minStock: 3,
      maxStock: 10,
      unitCost: 15.75,
      supplier: "Amazon Business",
      location: "Van - Section A",
      lastUsed: "2023-08-20",
      status: "In Stock"
    }
  ]

  const categories = ["all", "Hydraulic Parts", "Electronics", "Consumables", "Tools"]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock": return "bg-green-100 text-green-800"
      case "Low Stock": return "bg-yellow-100 text-yellow-800"
      case "Out of Stock": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "In Stock": return CheckCircle
      case "Low Stock": return AlertTriangle
      case "Out of Stock": return AlertTriangle
      default: return Package
    }
  }

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.brand.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const totalValue = inventoryItems.reduce((sum, item) => sum + (item.currentStock * item.unitCost), 0)
  const lowStockItems = inventoryItems.filter(item => item.currentStock <= item.minStock).length
  const outOfStockItems = inventoryItems.filter(item => item.currentStock === 0).length

  return (
    <MainLayout
      title="Inventory Management"
      subtitle="Track your personal stock and supplies"
    >
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-dental-blue" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Items</p>
                  <p className="text-2xl font-bold text-dental-blue">{inventoryItems.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Low Stock</p>
                  <p className="text-2xl font-bold text-yellow-600">{lowStockItems}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                  <p className="text-2xl font-bold text-red-600">{outOfStockItems}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <ShoppingCart className="h-8 w-8 text-dental-blue" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-dental-blue">${totalValue.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, SKU, or brand..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className={selectedCategory === category ? "bg-dental-blue" : ""}
                    >
                      {category === "all" ? "All" : category}
                    </Button>
                  ))}
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inventory List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Inventory Items</CardTitle>
              <Button className="bg-dental-blue">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredItems.map((item) => {
                const StatusIcon = getStatusIcon(item.status)
                return (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <StatusIcon className="h-5 w-5" />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.brand} • SKU: {item.sku}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm mb-4">
                      <div>
                        <p className="font-medium text-gray-700">Current Stock</p>
                        <p className="text-lg font-bold text-dental-blue">{item.currentStock}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Min/Max</p>
                        <p>{item.minStock}/{item.maxStock}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Unit Cost</p>
                        <p>${item.unitCost.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Total Value</p>
                        <p>${(item.currentStock * item.unitCost).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Location</p>
                        <p>{item.location}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Last Used</p>
                        <p>{item.lastUsed}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium min-w-[3rem] text-center">
                          {item.currentStock}
                        </span>
                        <Button size="sm" variant="outline">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Reorder
                        </Button>
                        {item.currentStock <= item.minStock && (
                          <Button size="sm" className="bg-dental-yellow hover:bg-dental-yellow/90 text-gray-900">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Order Now
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Reorder List */}
        <Card>
          <CardHeader>
            <CardTitle>Suggested Reorders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {inventoryItems
                .filter(item => item.currentStock <= item.minStock)
                .map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg bg-yellow-50">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        Current: {item.currentStock} • Min: {item.minStock} • ${item.unitCost}/unit
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Order {item.maxStock - item.currentStock} units</span>
                      <Button size="sm" className="bg-dental-blue">
                        Order
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
