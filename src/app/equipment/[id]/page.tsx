"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Wrench,
  Calendar,
  FileText,
  Package,
  Camera,
  Download,
  ExternalLink,
  ShoppingCart,
  AlertTriangle,
  CheckCircle,
  Clock,
  QrCode
} from "lucide-react"
import QRCode from "react-qr-code"

export default function EquipmentDetails() {
  // Sample equipment data
  const equipment = {
    id: "DT-EQ-001",
    clinic: "Bright Smiles Dental",
    serialNumber: "AS500-2023-001",
    brand: "A-Dec",
    model: "500 Series Chair",
    purchaseDate: "2023-01-15",
    warrantyExpiration: "2025-01-15",
    lastService: "2023-07-20",
    nextService: "2023-10-20",
    status: "Active",
    qrCode: "DT-EQ-001-AS500-2023-001"
  }

  const repairHistory = [
    {
      id: "REP-001",
      date: "2023-07-20",
      type: "Routine Maintenance",
      technician: "John Doe",
      description: "Cleaned and lubricated chair mechanisms, tested all functions",
      partsUsed: ["Lubricant", "Filter"],
      cost: 125.00,
      status: "Completed",
      photos: 3
    },
    {
      id: "REP-002",
      date: "2023-05-15",
      type: "Emergency Repair",
      technician: "John Doe",
      description: "Replaced faulty hydraulic pump, calibrated chair movements",
      partsUsed: ["Hydraulic Pump", "Seal Kit"],
      cost: 485.00,
      status: "Completed",
      photos: 5
    },
    {
      id: "REP-003",
      date: "2023-03-10",
      type: "Warranty Service",
      technician: "Sarah Smith",
      description: "Replaced defective control panel under warranty",
      partsUsed: ["Control Panel"],
      cost: 0.00,
      status: "Completed",
      photos: 2
    }
  ]

  const availableParts = [
    {
      sku: "AD-500-HP-001",
      name: "Hydraulic Pump Assembly",
      price: 385.00,
      stock: "In Stock",
      supplier: "A-Dec Direct"
    },
    {
      sku: "AD-500-CP-002",
      name: "Control Panel",
      price: 275.00,
      stock: "Low Stock",
      supplier: "A-Dec Direct"
    },
    {
      sku: "AD-500-SK-003",
      name: "Seal Kit",
      price: 45.00,
      stock: "In Stock",
      supplier: "Patterson Dental"
    },
    {
      sku: "AD-500-LU-004",
      name: "Lubricant Kit",
      price: 25.00,
      stock: "In Stock",
      supplier: "Patterson Dental"
    }
  ]

  const manuals = [
    {
      title: "A-Dec 500 Service Manual",
      type: "Service Manual",
      pages: 156,
      lastUpdated: "2023-01-01"
    },
    {
      title: "Installation Guide",
      type: "Installation",
      pages: 24,
      lastUpdated: "2022-12-15"
    },
    {
      title: "Parts Catalog",
      type: "Parts Reference",
      pages: 89,
      lastUpdated: "2023-06-01"
    }
  ]

  return (
    <MainLayout
      title={`${equipment.brand} ${equipment.model}`}
      subtitle={`Serial: ${equipment.serialNumber} • ${equipment.clinic}`}
    >
      <div className="space-y-6">
        {/* Equipment Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-3">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Equipment Overview</CardTitle>
                <Badge
                  variant={equipment.status === "Active" ? "default" : "destructive"}
                  className={equipment.status === "Active" ? "bg-green-100 text-green-800" : ""}
                >
                  {equipment.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Brand</p>
                  <p className="text-lg">{equipment.brand}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Model</p>
                  <p className="text-lg">{equipment.model}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Purchase Date</p>
                  <p className="text-lg">{equipment.purchaseDate}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Warranty</p>
                  <p className="text-lg">{equipment.warrantyExpiration}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Last Service</p>
                  <p className="text-lg">{equipment.lastService}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Next Service</p>
                  <p className="text-lg text-dental-blue font-medium">{equipment.nextService}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Total Repairs</p>
                  <p className="text-lg">{repairHistory.length}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Clinic</p>
                  <p className="text-lg">{equipment.clinic}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* QR Code */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">QR Code</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="bg-white p-3 rounded-lg border inline-block">
                <QRCode value={equipment.qrCode} size={120} />
              </div>
              <div className="mt-3 space-y-2">
                <Button size="sm" variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button size="sm" className="w-full bg-dental-blue">
                  <Wrench className="h-4 w-4 mr-2" />
                  Start Repair
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Information Tabs */}
        <Tabs defaultValue="history" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="history">Repair History</TabsTrigger>
            <TabsTrigger value="parts">Parts & Inventory</TabsTrigger>
            <TabsTrigger value="manuals">Service Manuals</TabsTrigger>
            <TabsTrigger value="photos">Photos & Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Repair History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {repairHistory.map((repair) => (
                    <div key={repair.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{repair.type}</Badge>
                          <span className="text-sm text-gray-500">{repair.date}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-dental-blue">
                            ${repair.cost.toFixed(2)}
                          </span>
                          <Badge className="bg-green-100 text-green-800">
                            {repair.status}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-3">{repair.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-700">Technician</p>
                          <p>{repair.technician}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Parts Used</p>
                          <p>{repair.partsUsed.join(", ")}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Photos</p>
                          <p>{repair.photos} images</p>
                        </div>
                      </div>

                      <div className="flex space-x-2 mt-3">
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4 mr-2" />
                          View Report
                        </Button>
                        <Button size="sm" variant="outline">
                          <Camera className="h-4 w-4 mr-2" />
                          View Photos
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="parts" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Compatible Parts</CardTitle>
                  <Button className="bg-dental-blue">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Order Parts
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {availableParts.map((part) => (
                    <div key={part.sku} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="font-medium">{part.name}</p>
                          <p className="text-sm text-gray-500">SKU: {part.sku}</p>
                          <p className="text-sm text-gray-500">Supplier: {part.supplier}</p>
                        </div>
                        <div className="text-right space-y-2">
                          <p className="text-lg font-bold text-dental-blue">${part.price}</p>
                          <Badge
                            variant={part.stock === "In Stock" ? "default" : "destructive"}
                            className={part.stock === "In Stock" ? "bg-green-100 text-green-800" : ""}
                          >
                            {part.stock}
                          </Badge>
                          <div>
                            <Button size="sm" variant="outline">
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manuals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Service Manuals & Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {manuals.map((manual, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="font-medium">{manual.title}</p>
                          <div className="flex space-x-4 text-sm text-gray-500">
                            <span>{manual.type}</span>
                            <span>{manual.pages} pages</span>
                            <span>Updated: {manual.lastUpdated}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Online
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="photos" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Photos & Documents</CardTitle>
                  <Button className="bg-dental-blue">
                    <Camera className="h-4 w-4 mr-2" />
                    Add Photo
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                      <div className="text-center">
                        <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-500">Photo {i}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
