"use client"

import { useState, useMemo } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  Eye,
  Edit,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  Trash2
} from "lucide-react"
import { useInvoices, useInvoiceSummary } from "@/lib/hooks/useInvoice"
import { useClient } from "@/lib/hooks/useClient"
import { useToast } from "@/hooks/useToast"
import type { Invoice, CreateInvoiceInput } from "@/lib/models/invoice"

// Toast container component
interface ToastType {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
}

function ToastContainer({ toasts, onRemove }: { toasts: ToastType[], onRemove: (id: string) => void }) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded-lg shadow-lg flex items-center justify-between min-w-[300px] ${
            toast.type === 'success' ? 'bg-green-600 text-white' :
            toast.type === 'error' ? 'bg-red-600 text-white' :
            'bg-blue-600 text-white'
          }`}
        >
          <span>{toast.message}</span>
          <button onClick={() => onRemove(toast.id)} className="ml-4">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}

export default function Invoices() {
  const [activeTab, setActiveTab] = useState<"create" | "list">("list")
  const { invoices, loading, error, saving, create, update, markAsPaid, remove } = useInvoices()
  const { clients } = useClient()
  const { stats, loading: statsLoading } = useInvoiceSummary()
  const toast = useToast()

  // State for mark as paid dialog
  const [markPaidDialog, setMarkPaidDialog] = useState<{
    open: boolean
    invoiceId: string | null
    paymentMethod: string
    paymentReference: string
  }>({
    open: false,
    invoiceId: null,
    paymentMethod: '',
    paymentReference: ''
  })

  // State for edit dialog
  const [editDialog, setEditDialog] = useState<{
    open: boolean
    invoice: Invoice | null
  }>({
    open: false,
    invoice: null
  })

  // Invoice form state
  const [invoiceForm, setInvoiceForm] = useState({
    clientId: "",
    clientName: "",
    description: "",
    serviceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    laborHours: "",
    laborRate: "75",
    parts: [{ description: "", quantity: 1, price: "" }],
    notes: "",
    tax: "0"
  })

  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const addPartLine = () => {
    setInvoiceForm({
      ...invoiceForm,
      parts: [...invoiceForm.parts, { description: "", quantity: 1, price: "" }]
    })
  }

  const removePartLine = (index: number) => {
    setInvoiceForm({
      ...invoiceForm,
      parts: invoiceForm.parts.filter((_, i) => i !== index)
    })
  }

  const updatePart = (index: number, field: string, value: string | number) => {
    const updatedParts = invoiceForm.parts.map((part, i) =>
      i === index ? { ...part, [field]: value } : part
    )
    setInvoiceForm({ ...invoiceForm, parts: updatedParts })
  }

  const calculateSubtotal = () => {
    const laborTotal = parseFloat(invoiceForm.laborHours || "0") * parseFloat(invoiceForm.laborRate || "0")
    const partsTotal = invoiceForm.parts.reduce((sum, part) =>
      sum + (part.quantity * parseFloat(part.price || "0")), 0
    )
    return laborTotal + partsTotal
  }

  const calculateTax = () => {
    return calculateSubtotal() * (parseFloat(invoiceForm.tax || "0") / 100)
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax()
  }

  const validateForm = (): boolean => {
    const errors: string[] = []

    if (!invoiceForm.clientId) {
      errors.push("Please select a client")
    }
    if (!invoiceForm.description) {
      errors.push("Please enter a service description")
    }
    if (!invoiceForm.serviceDate) {
      errors.push("Please select a service date")
    }
    if (!invoiceForm.dueDate) {
      errors.push("Please select a due date")
    }

    // Check if there's at least some billable item
    const hasLabor = parseFloat(invoiceForm.laborHours || "0") > 0
    const hasParts = invoiceForm.parts.some(p =>
      p.description && parseFloat(p.price || "0") > 0
    )

    if (!hasLabor && !hasParts) {
      errors.push("Please add labor hours or parts")
    }

    setValidationErrors(errors)
    return errors.length === 0
  }

  const handleCreateInvoice = async () => {
    if (!validateForm()) {
      toast.error("Please fix validation errors")
      return
    }

    const lineItems = []

    // Add labor as a line item if present
    if (parseFloat(invoiceForm.laborHours || "0") > 0) {
      const hours = parseFloat(invoiceForm.laborHours)
      const rate = parseFloat(invoiceForm.laborRate)
      lineItems.push({
        id: crypto.randomUUID(),
        description: `Labor - ${invoiceForm.description} (${hours} hrs @ $${rate}/hr)`,
        quantity: hours,
        unitPrice: rate,
        total: hours * rate
      })
    }

    // Add parts as line items
    invoiceForm.parts.forEach(part => {
      if (part.description && parseFloat(part.price || "0") > 0) {
        const quantity = part.quantity
        const unitPrice = parseFloat(part.price)
        lineItems.push({
          id: crypto.randomUUID(),
          description: part.description,
          quantity,
          unitPrice,
          total: quantity * unitPrice
        })
      }
    })

    const subtotal = calculateSubtotal()
    const tax = calculateTax()
    const total = calculateTotal()

    const invoiceData: Omit<CreateInvoiceInput, 'invoiceNumber'> = {
      clientId: invoiceForm.clientId,
      clientName: invoiceForm.clientName,
      subtotal,
      tax,
      total,
      amountPaid: 0,
      amountDue: total,
      lineItems,
      status: 'Draft',
      invoiceDate: new Date(invoiceForm.serviceDate),
      dueDate: new Date(invoiceForm.dueDate),
      notes: invoiceForm.notes || undefined
    }

    const result = await create(invoiceData)

    if (result) {
      toast.success(`Invoice ${result.invoiceNumber} created successfully!`)
      // Reset form
      setInvoiceForm({
        clientId: "",
        clientName: "",
        description: "",
        serviceDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        laborHours: "",
        laborRate: "75",
        parts: [{ description: "", quantity: 1, price: "" }],
        notes: "",
        tax: "0"
      })
      setValidationErrors([])
      setActiveTab("list")
    } else if (error) {
      toast.error(error.message)
    }
  }

  const handleMarkAsPaid = async () => {
    if (!markPaidDialog.invoiceId || !markPaidDialog.paymentMethod) {
      toast.error("Please select a payment method")
      return
    }

    const result = await markAsPaid(
      markPaidDialog.invoiceId,
      markPaidDialog.paymentMethod,
      markPaidDialog.paymentReference
    )

    if (result) {
      toast.success("Invoice marked as paid!")
      setMarkPaidDialog({ open: false, invoiceId: null, paymentMethod: '', paymentReference: '' })
    } else if (error) {
      toast.error(error.message)
    }
  }

  const handleDownloadPDF = (invoice: Invoice) => {
    // Simple PDF generation using window.print
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoice.invoiceNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .invoice-info { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f2f2f2; }
            .total-row { font-weight: bold; background-color: #f9f9f9; }
            .status { display: inline-block; padding: 4px 12px; border-radius: 4px; }
            .status-paid { background: #d1fae5; color: #065f46; }
            .status-pending { background: #fef3c7; color: #92400e; }
            .status-overdue { background: #fee2e2; color: #991b1b; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>INVOICE</h1>
            <h2>${invoice.invoiceNumber}</h2>
          </div>

          <div class="invoice-info">
            <p><strong>Client:</strong> ${invoice.clientName}</p>
            <p><strong>Invoice Date:</strong> ${new Date(invoice.invoiceDate).toLocaleDateString()}</p>
            <p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
            <p><strong>Status:</strong> <span class="status status-${invoice.status.toLowerCase()}">${invoice.status}</span></p>
          </div>

          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.lineItems.map(item => `
                <tr>
                  <td>${item.description}</td>
                  <td>${item.quantity}</td>
                  <td>$${item.unitPrice.toFixed(2)}</td>
                  <td>$${item.total.toFixed(2)}</td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td colspan="3">Subtotal</td>
                <td>$${invoice.subtotal.toFixed(2)}</td>
              </tr>
              <tr class="total-row">
                <td colspan="3">Tax</td>
                <td>$${invoice.tax.toFixed(2)}</td>
              </tr>
              <tr class="total-row">
                <td colspan="3">Total</td>
                <td>$${invoice.total.toFixed(2)}</td>
              </tr>
              <tr class="total-row">
                <td colspan="3">Amount Due</td>
                <td>$${invoice.amountDue.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          ${invoice.notes ? `<div style="margin-top: 30px;"><strong>Notes:</strong><p>${invoice.notes}</p></div>` : ''}
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.print()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid": return "bg-green-100 text-green-800"
      case "Sent": return "bg-blue-100 text-blue-800"
      case "Draft": return "bg-gray-100 text-gray-800"
      case "Overdue": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Paid": return CheckCircle
      case "Sent": return Send
      case "Overdue": return AlertCircle
      default: return Clock
    }
  }

  return (
    <MainLayout
      title="Invoice Management"
      subtitle="Create, track, and manage service invoices"
    >
      <ToastContainer toasts={toast.toasts} onRemove={toast.remove} />

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
                      <p className="text-2xl font-bold text-dental-blue">
                        {statsLoading ? '...' : `$${stats.totalOutstanding.toFixed(2)}`}
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
                      <p className="text-sm font-medium text-gray-600">Paid This Month</p>
                      <p className="text-2xl font-bold text-green-600">
                        {statsLoading ? '...' : `$${stats.paidThisMonth.toFixed(2)}`}
                      </p>
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
                      <p className="text-2xl font-bold text-yellow-600">
                        {statsLoading ? '...' : `$${stats.pending.toFixed(2)}`}
                      </p>
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
                      <p className="text-2xl font-bold text-red-600">
                        {statsLoading ? '...' : `$${stats.overdue.toFixed(2)}`}
                      </p>
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
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-dental-blue" />
                  </div>
                ) : invoices.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No invoices yet. Create your first invoice!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {invoices.map((invoice) => {
                      const StatusIcon = getStatusIcon(invoice.status)
                      return (
                        <div key={invoice.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <StatusIcon className="h-5 w-5" />
                              <div>
                                <p className="font-medium">{invoice.invoiceNumber}</p>
                                <p className="text-sm text-gray-500">{invoice.clientName}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-dental-blue">
                                ${invoice.total.toFixed(2)}
                              </p>
                              <Badge className={getStatusColor(invoice.status)}>
                                {invoice.status}
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-3">
                            <div>
                              <p className="font-medium text-gray-700">Invoice Date</p>
                              <p>{new Date(invoice.invoiceDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-700">Due Date</p>
                              <p>{new Date(invoice.dueDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-700">Amount Due</p>
                              <p className="font-semibold">${invoice.amountDue.toFixed(2)}</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadPDF(invoice)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              PDF
                            </Button>
                            {invoice.status !== 'Paid' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setMarkPaidDialog({
                                  open: true,
                                  invoiceId: invoice.id!,
                                  paymentMethod: '',
                                  paymentReference: ''
                                })}
                                disabled={saving}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Mark Paid
                              </Button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
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
                  {/* Validation Errors */}
                  {validationErrors.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3" />
                        <div>
                          <p className="font-medium text-red-800">Please fix the following errors:</p>
                          <ul className="mt-2 list-disc list-inside text-sm text-red-700">
                            {validationErrors.map((error, i) => (
                              <li key={i}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="client">Client *</Label>
                      <Select
                        value={invoiceForm.clientId}
                        onValueChange={(value) => {
                          const selectedClient = clients.find(c => c.id === value)
                          setInvoiceForm({
                            ...invoiceForm,
                            clientId: value,
                            clientName: selectedClient?.name || ''
                          })
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map(client => (
                            <SelectItem key={client.id} value={client.id!}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="serviceDate">Service Date *</Label>
                      <Input
                        id="serviceDate"
                        type="date"
                        value={invoiceForm.serviceDate}
                        onChange={(e) => setInvoiceForm({...invoiceForm, serviceDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="dueDate">Due Date *</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={invoiceForm.dueDate}
                        onChange={(e) => setInvoiceForm({...invoiceForm, dueDate: e.target.value})}
                      />
                    </div>
                  </div>

                  {/* Service Description */}
                  <div>
                    <Label htmlFor="description">Service Description *</Label>
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
                        <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3">
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
                          <div className="flex items-center">
                            {invoiceForm.parts.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removePartLine(index)}
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Tax & Notes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tax">Tax Rate (%)</Label>
                      <Input
                        id="tax"
                        type="number"
                        step="0.1"
                        value={invoiceForm.tax}
                        onChange={(e) => setInvoiceForm({...invoiceForm, tax: e.target.value})}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea
                        id="notes"
                        value={invoiceForm.notes}
                        onChange={(e) => setInvoiceForm({...invoiceForm, notes: e.target.value})}
                        placeholder="Any additional notes..."
                        rows={2}
                      />
                    </div>
                  </div>

                  {/* Total */}
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Subtotal:</span>
                      <span className="font-semibold">${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Tax:</span>
                      <span className="font-semibold">${calculateTax().toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total Amount:</span>
                      <span className="text-2xl font-bold text-dental-blue">
                        ${calculateTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3">
                    <Button
                      className="bg-dental-blue"
                      onClick={handleCreateInvoice}
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <FileText className="h-4 w-4 mr-2" />
                          Create Invoice
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("list")}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Mark as Paid Dialog */}
      <Dialog open={markPaidDialog.open} onOpenChange={(open) =>
        setMarkPaidDialog({ ...markPaidDialog, open })
      }>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Invoice as Paid</DialogTitle>
            <DialogDescription>
              Record payment information for this invoice
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="paymentMethod">Payment Method *</Label>
              <Select
                value={markPaidDialog.paymentMethod}
                onValueChange={(value) =>
                  setMarkPaidDialog({ ...markPaidDialog, paymentMethod: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Check">Check</SelectItem>
                  <SelectItem value="Credit Card">Credit Card</SelectItem>
                  <SelectItem value="ACH">ACH/Bank Transfer</SelectItem>
                  <SelectItem value="Wire Transfer">Wire Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="paymentReference">Reference Number (Optional)</Label>
              <Input
                id="paymentReference"
                value={markPaidDialog.paymentReference}
                onChange={(e) =>
                  setMarkPaidDialog({ ...markPaidDialog, paymentReference: e.target.value })
                }
                placeholder="Transaction ID, check number, etc."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setMarkPaidDialog({ open: false, invoiceId: null, paymentMethod: '', paymentReference: '' })}
            >
              Cancel
            </Button>
            <Button
              onClick={handleMarkAsPaid}
              disabled={saving || !markPaidDialog.paymentMethod}
              className="bg-green-600 hover:bg-green-700"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Paid
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  )
}
