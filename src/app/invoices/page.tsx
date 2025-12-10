"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  FileText,
  Plus,
  Send,
  Download,
  Printer,
  Eye,
  Edit,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  QrCode,
  ScanLine
} from "lucide-react"

export default function Invoices() {
  const [activeTab, setActiveTab] = useState<"create" | "list">("list")

  // Sample invoice data
  const invoices = [
    {
      id: "INV-2023-001",
      clinic: "Bright Smiles Dental",
      date: "2023-08-20",
      dueDate: "2023-09-04",
      amount: 485.00,
      status: "Paid",
      services: ["Emergency Repair", "Parts Replacement"],
      equipment: "A-Dec 500 Chair"
    },
    {
      id: "INV-2023-002",
      clinic: "Family Dental Care",
      date: "2023-08-19",
      dueDate: "2023-09-03",
      amount: 275.00,
      status: "Pending",
      services: ["Routine Maintenance"],
      equipment: "Planmeca X-Ray Unit"
    },
    {
      id: "INV-2023-003",
      clinic: "Downtown Dentistry",
      date: "2023-08-18",
      dueDate: "2023-09-02",
      amount: 125.00,
      status: "Overdue",
      services: ["Installation"],
      equipment: "Dentsply Handpiece"
    }
  ]

  // Invoice form state
  const [invoiceForm, setInvoiceForm] = useState({
    clinic: "",
    equipment: "",
    serviceDate: "",
    description: "",
    laborHours: "",
    laborRate: "75",
    laborType: "",
    parts: [{ description: "", quantity: 1, price: "" }],
    notes: "",
    internalNotes: ""
  })

  const addPartLine = () => {
    setInvoiceForm({
      ...invoiceForm,
      parts: [...invoiceForm.parts, { description: "", quantity: 1, price: "" }]
    })
  }

  const updatePart = (index: number, field: string, value: string | number) => {
    const updatedParts = invoiceForm.parts.map((part, i) =>
      i === index ? { ...part, [field]: value } : part
    )
    setInvoiceForm({ ...invoiceForm, parts: updatedParts })
  }

  const calculateTotal = () => {
    const laborTotal = parseFloat(invoiceForm.laborHours || "0") * parseFloat(invoiceForm.laborRate || "0")
    const partsTotal = invoiceForm.parts.reduce((sum, part) =>
      sum + (part.quantity * parseFloat(part.price || "0")), 0
    )
    return laborTotal + partsTotal
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid": return "bg-green-100 text-green-800"
      case "Pending": return "bg-yellow-100 text-yellow-800"
      case "Overdue": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Paid": return CheckCircle
      case "Pending": return Clock
      case "Overdue": return AlertCircle
      default: return FileText
    }
  }

  return (
    <MainLayout
      title="Invoice Management"
      subtitle="Create, track, and manage service invoices"
    >
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <Button
            variant={activeTab === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("list")}
            className={activeTab === "list" ? "bg-dental-blue" : ""}
          >
            <FileText className="h-4 w-4 mr-2" />
            All Invoices
          </Button>
          <Button
            variant={activeTab === "create" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("create")}
            className={activeTab === "create" ? "bg-dental-blue" : ""}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Invoice
          </Button>
        </div>

        {activeTab === "list" ? (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <DollarSign className="h-8 w-8 text-dental-blue" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Outstanding</p>
                      <p className="text-2xl font-bold text-dental-blue">$400.00</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Paid This Month</p>
                      <p className="text-2xl font-bold text-green-600">$485.00</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Clock className="h-8 w-8 text-yellow-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Pending</p>
                      <p className="text-2xl font-bold text-yellow-600">$275.00</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <AlertCircle className="h-8 w-8 text-red-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Overdue</p>
                      <p className="text-2xl font-bold text-red-600">$125.00</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Invoice List */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invoices.map((invoice) => {
                    const StatusIcon = getStatusIcon(invoice.status)
                    return (
                      <div key={invoice.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <StatusIcon className="h-5 w-5" />
                            <div>
                              <p className="font-medium">{invoice.id}</p>
                              <p className="text-sm text-gray-500">{invoice.clinic}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-dental-blue">
                              ${invoice.amount.toFixed(2)}
                            </p>
                            <Badge className={getStatusColor(invoice.status)}>
                              {invoice.status}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <p className="font-medium text-gray-700">Equipment</p>
                            <p>{invoice.equipment}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700">Services</p>
                            <p>{invoice.services.join(", ")}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700">Date</p>
                            <p>{invoice.date}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700">Due Date</p>
                            <p>{invoice.dueDate}</p>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          <Button size="sm" variant="outline">
                            <Send className="h-4 w-4 mr-2" />
                            Send
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-full max-w-4xl">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Invoice</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="clinic">Clinic Name</Label>
                      <Input
                        id="clinic"
                        value={invoiceForm.clinic}
                        onChange={(e) => setInvoiceForm({...invoiceForm, clinic: e.target.value})}
                        placeholder="Select or enter clinic name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="equipment">Equipment</Label>
                      <div className="flex gap-2">
                        <Input
                          id="equipment"
                          value={invoiceForm.equipment}
                          onChange={(e) => setInvoiceForm({...invoiceForm, equipment: e.target.value})}
                          placeholder="Equipment serviced"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          title="Quick Scan Equipment"
                        >
                          <ScanLine className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  <div>
                    <Label htmlFor="serviceDate">Service Date</Label>
                    <Input
                      id="serviceDate"
                      type="date"
                      value={invoiceForm.serviceDate}
                      onChange={(e) => setInvoiceForm({...invoiceForm, serviceDate: e.target.value})}
                    />
                  </div>
                </div>

                {/* Service Description */}
                <div>
                  <Label htmlFor="description">Service Description</Label>
                  <Textarea
                    id="description"
                    value={invoiceForm.description}
                    onChange={(e) => setInvoiceForm({...invoiceForm, description: e.target.value})}
                    placeholder="Describe the work performed..."
                    rows={3}
                  />
                </div>

                <Separator />

                {/* Labor */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Labor</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="laborType">Labor Type / Code</Label>
                      <Select
                        value={invoiceForm.laborType}
                        onValueChange={(value) => setInvoiceForm({...invoiceForm, laborType: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select labor type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="emergency-repair">Emergency Repair</SelectItem>
                          <SelectItem value="routine-maintenance">Routine Maintenance</SelectItem>
                          <SelectItem value="installation">Installation</SelectItem>
                          <SelectItem value="calibration">Calibration</SelectItem>
                          <SelectItem value="diagnostic">Diagnostic</SelectItem>
                          <SelectItem value="preventive-maintenance">Preventive Maintenance</SelectItem>
                          <SelectItem value="training">Training & Support</SelectItem>
                          <SelectItem value="consultation">Consultation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="laborHours">Hours Worked</Label>
                      <Input
                        id="laborHours"
                        type="number"
                        step="0.5"
                        value={invoiceForm.laborHours}
                        onChange={(e) => setInvoiceForm({...invoiceForm, laborHours: e.target.value})}
                        placeholder="0.0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="laborRate">Rate per Hour</Label>
                      <Input
                        id="laborRate"
                        type="number"
                        value={invoiceForm.laborRate}
                        onChange={(e) => setInvoiceForm({...invoiceForm, laborRate: e.target.value})}
                        placeholder="75.00"
                      />
                    </div>
                    <div>
                      <Label>Labor Total</Label>
                      <div className="h-10 px-3 py-2 border rounded-md bg-gray-50 flex items-center">
                        <span className="font-semibold">
                          ${(parseFloat(invoiceForm.laborHours || "0") * parseFloat(invoiceForm.laborRate || "0")).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Parts */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Parts & Materials</h3>
                    <Button onClick={addPartLine} variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Part
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {invoiceForm.parts.map((part, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div className="md:col-span-2">
                          <Input
                            value={part.description}
                            onChange={(e) => updatePart(index, "description", e.target.value)}
                            placeholder="Part description"
                          />
                        </div>
                        <div>
                          <Input
                            type="number"
                            value={part.quantity}
                            onChange={(e) => updatePart(index, "quantity", parseInt(e.target.value) || 1)}
                            placeholder="Qty"
                            min="1"
                          />
                        </div>
                        <div>
                          <Input
                            type="number"
                            step="0.01"
                            value={part.price}
                            onChange={(e) => updatePart(index, "price", e.target.value)}
                            placeholder="Unit price"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Notes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="notes">Additional Notes (Customer Visible)</Label>
                    <Textarea
                      id="notes"
                      value={invoiceForm.notes}
                      onChange={(e) => setInvoiceForm({...invoiceForm, notes: e.target.value})}
                      placeholder="Any additional notes or terms for the customer..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="internalNotes">Internal Notes (Private)</Label>
                    <Textarea
                      id="internalNotes"
                      value={invoiceForm.internalNotes}
                      onChange={(e) => setInvoiceForm({...invoiceForm, internalNotes: e.target.value})}
                      placeholder="Internal notes for your records only..."
                      rows={3}
                      className="border-orange-200 focus:border-orange-400"
                    />
                  </div>
                </div>

                {/* Total */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Amount:</span>
                    <span className="text-2xl font-bold text-dental-blue">
                      ${calculateTotal().toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <Button className="bg-dental-blue">
                    <FileText className="h-4 w-4 mr-2" />
                    Create Invoice
                  </Button>
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Save Draft
                  </Button>
                </div>
              </CardContent>
            </Card>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
