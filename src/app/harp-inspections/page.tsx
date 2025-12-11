"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  FileText,
  Plus,
  Download,
  Eye,
  Filter,
  X,
  Search,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  Mail,
  Loader2
} from "lucide-react"
import { useHarpInspections } from "@/lib/hooks/useHarpInspection"
import { useAuth } from "@/contexts/AuthContext"
import { sendHarpReportEmail } from "@/lib/email"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import {
  DialogFooter
} from "@/components/ui/dialog"
import type { HarpInspection, HarpStatus } from "@/lib/models/harp-inspection"

const STATUS_COLORS: Record<HarpStatus, string> = {
  'Draft': 'bg-gray-100 text-gray-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  'Completed': 'bg-green-100 text-green-800',
  'Submitted': 'bg-purple-100 text-purple-800',
  'Failed': 'bg-red-100 text-red-800',
}

export default function HarpInspectionsHistoryPage() {
  const router = useRouter()
  const { inspections, loading, error, regeneratePDF } = useHarpInspections()
  const { user, userData } = useAuth()

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [selectedInspection, setSelectedInspection] = useState<HarpInspection | null>(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [generatingPDF, setGeneratingPDF] = useState<string | null>(null)
  const [emailDialog, setEmailDialog] = useState<{
    open: boolean
    inspection: HarpInspection | null
    recipientEmail: string
    sending: boolean
  }>({
    open: false,
    inspection: null,
    recipientEmail: '',
    sending: false
  })

  // Filter inspections
  const filteredInspections = inspections.filter(inspection => {
    const matchesSearch =
      inspection.clinicName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inspection.accountNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inspection.equipmentMake.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inspection.equipmentModel.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || inspection.status === statusFilter

    let matchesDate = true
    if (dateFilter !== "all") {
      const inspectionDate = new Date(inspection.inspectionDate)
      const now = new Date()
      const daysDiff = Math.floor((now.getTime() - inspectionDate.getTime()) / (1000 * 60 * 60 * 24))

      if (dateFilter === "7days") matchesDate = daysDiff <= 7
      else if (dateFilter === "30days") matchesDate = daysDiff <= 30
      else if (dateFilter === "90days") matchesDate = daysDiff <= 90
    }

    return matchesSearch && matchesStatus && matchesDate
  })

  const handleViewDetails = (inspection: HarpInspection) => {
    setSelectedInspection(inspection)
    setDetailsDialogOpen(true)
  }

  const handleRegeneratePDF = async (inspection: HarpInspection) => {
    if (!inspection.id) return

    setGeneratingPDF(inspection.id)
    try {
      await regeneratePDF(inspection.id)
    } finally {
      setGeneratingPDF(null)
    }
  }

  const handleEmailReport = async () => {
    if (!emailDialog.inspection || !emailDialog.recipientEmail) {
      toast.error("Please enter a recipient email")
      return
    }

    if (!user || !userData) {
      toast.error("You must be logged in to send emails")
      return
    }

    if (userData.role !== 'admin' && userData.role !== 'tech') {
      toast.error("Only admins and technicians can send emails")
      return
    }

    setEmailDialog(prev => ({ ...prev, sending: true }))

    try {
      // Generate PDF
      const pdfResponse = await fetch('/api/harp-inspection/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailDialog.inspection)
      })

      if (!pdfResponse.ok) {
        throw new Error('Failed to generate PDF')
      }

      const pdfBlob = await pdfResponse.blob()
      const reader = new FileReader()

      const pdfBase64 = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const base64 = reader.result as string
          const base64Data = base64.split(',')[1]
          resolve(base64Data)
        }
        reader.onerror = reject
        reader.readAsDataURL(pdfBlob)
      })

      // Send email
      const result = await sendHarpReportEmail(
        emailDialog.inspection,
        emailDialog.recipientEmail,
        pdfBase64,
        {
          email: user.email || '',
          role: userData.role,
          uid: user.uid
        }
      )

      if (result.success) {
        toast.success(`Inspection report emailed successfully to ${emailDialog.recipientEmail}`)
        setEmailDialog({ open: false, inspection: null, recipientEmail: '', sending: false })
      } else {
        toast.error(result.error || 'Failed to send email')
      }
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    const error = err;
      console.error('Error emailing inspection report:', error)
      toast.error(error.message || 'Failed to email inspection report')
    } finally {
      setEmailDialog(prev => ({ ...prev, sending: false }))
    }
  }

  const clearFilters = () => {
    setSearchQuery("")
    setStatusFilter("all")
    setDateFilter("all")
  }

  const activeFiltersCount = [
    searchQuery !== "",
    statusFilter !== "all",
    dateFilter !== "all"
  ].filter(Boolean).length

  if (loading) {
    return (
      <MainLayout title="HARP Inspections" subtitle="Inspection history and records">
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </MainLayout>
    )
  }

  if (error) {
    return (
      <MainLayout title="HARP Inspections" subtitle="Inspection history and records">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error Loading Inspections</h3>
              <p className="text-gray-500 mb-4">{error.message}</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          </CardContent>
        </Card>
      </MainLayout>
    )
  }

  return (
    <MainLayout title="HARP Inspections" subtitle="Inspection history and records">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Total Inspections</p>
                <p className="text-3xl font-bold text-dental-blue mt-2">{inspections.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {inspections.filter(i => i.status === 'Completed').length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {inspections.filter(i => i.status === 'In Progress').length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-3xl font-bold text-red-600 mt-2">
                  {inspections.filter(i => i.status === 'Failed').length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Header with New Inspection Button */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Inspection History</h2>
            <p className="text-gray-600 mt-1">
              {filteredInspections.length} inspection{filteredInspections.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <Button
            className="bg-dental-blue hover:bg-dental-blue/90"
            onClick={() => router.push('/harp-inspections/new')}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Inspection
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              <span className="flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="outline" className="ml-2">
                    {activeFiltersCount} active
                  </Badge>
                )}
              </span>
              {activeFiltersCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search clinic, account, equipment..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Submitted">Submitted</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="90days">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Inspections List */}
        {filteredInspections.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Inspections Found</h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery || statusFilter !== "all" || dateFilter !== "all"
                    ? "Try adjusting your filters"
                    : "Create your first HARP inspection"}
                </p>
                {!searchQuery && statusFilter === "all" && dateFilter === "all" && (
                  <Button onClick={() => router.push('/harp-inspections/new')}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Inspection
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredInspections.map((inspection) => (
              <Card key={inspection.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg">{inspection.clinicName}</CardTitle>
                        <Badge className={STATUS_COLORS[inspection.status]}>
                          {inspection.status}
                        </Badge>
                        {inspection.passed !== undefined && (
                          <Badge variant="outline" className={inspection.passed ? 'border-green-500 text-green-700' : 'border-red-500 text-red-700'}>
                            {inspection.passed ? (
                              <><CheckCircle2 className="h-3 w-3 mr-1" />Passed</>
                            ) : (
                              <><AlertCircle className="h-3 w-3 mr-1" />Failed</>
                            )}
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Account:</span> {inspection.accountNumber}
                        </div>
                        <div>
                          <span className="font-medium">Equipment:</span> {inspection.equipmentMake} {inspection.equipmentModel}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(inspection.inspectionDate).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Technician:</span> {inspection.technicianName}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(inspection)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEmailDialog({
                        open: true,
                        inspection,
                        recipientEmail: '',
                        sending: false
                      })}
                      disabled={!userData || (userData.role !== 'admin' && userData.role !== 'tech')}
                    >
                      <Mail className="h-4 w-4 mr-1" />
                      Email Report
                    </Button>
                    <Button
                      size="sm"
                      className="bg-dental-blue hover:bg-dental-blue/90"
                      onClick={() => inspection.id && handleRegeneratePDF(inspection)}
                      disabled={generatingPDF === inspection.id}
                    >
                      {generatingPDF === inspection.id ? (
                        <><Clock className="h-4 w-4 mr-1 animate-spin" />Generating...</>
                      ) : (
                        <><Download className="h-4 w-4 mr-1" />Regenerate PDF</>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Details Dialog */}
        <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Inspection Details</DialogTitle>
              <DialogDescription>
                Complete inspection record and test results
              </DialogDescription>
            </DialogHeader>

            {selectedInspection && (
              <div className="space-y-6 mt-4">
                {/* Basic Info */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Clinic Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Clinic Name</p>
                      <p className="font-medium">{selectedInspection.clinicName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Account Number</p>
                      <p className="font-medium">{selectedInspection.accountNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Address</p>
                      <p className="font-medium">{selectedInspection.clinicAddress}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Phone</p>
                      <p className="font-medium">{selectedInspection.clinicPhone}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Room Number</p>
                      <p className="font-medium">{selectedInspection.roomNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Test Type</p>
                      <p className="font-medium">{selectedInspection.testType}</p>
                    </div>
                  </div>
                </div>

                {/* Equipment Info */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Equipment Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Make & Model</p>
                      <p className="font-medium">{selectedInspection.equipmentMake} {selectedInspection.equipmentModel}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Image Type</p>
                      <p className="font-medium">{selectedInspection.imageType}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Control Serial</p>
                      <p className="font-medium">{selectedInspection.controlSerial}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Tube Serial</p>
                      <p className="font-medium">{selectedInspection.tubeSerial}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">XRIS Number</p>
                      <p className="font-medium">{selectedInspection.xrisNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">X-ray Types</p>
                      <p className="font-medium">{selectedInspection.xrayTypes.join(', ')}</p>
                    </div>
                  </div>
                </div>

                {/* Test Results Summary */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Test Results</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Items 1-12 (MS count)</p>
                      <p className="font-medium">
                        {selectedInspection.items1to12.filter(i => i.result === 'MS').length} / {selectedInspection.items1to12.length}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Items 13-17 (MS count)</p>
                      <p className="font-medium">
                        {selectedInspection.items13to17.filter(i => i.result === 'MS').length} / {selectedInspection.items13to17.length}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Beam Alignment</p>
                      <p className="font-medium">{selectedInspection.beamAlignment}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Inspection Date</p>
                      <p className="font-medium">{new Date(selectedInspection.inspectionDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedInspection.notes && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Notes</h3>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedInspection.notes}</p>
                  </div>
                )}

                {/* Failure Reasons */}
                {selectedInspection.failureReasons && selectedInspection.failureReasons.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-red-600">Failure Reasons</h3>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      {selectedInspection.failureReasons.map((reason, index) => (
                        <li key={index}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Email Report Dialog */}
        <Dialog open={emailDialog.open} onOpenChange={(open) =>
          setEmailDialog({ ...emailDialog, open })
        }>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Email Inspection Report</DialogTitle>
              <DialogDescription>
                Send HARP inspection report for {emailDialog.inspection?.clinicName} via email
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="recipientEmail">Recipient Email *</Label>
                <Input
                  id="recipientEmail"
                  type="email"
                  value={emailDialog.recipientEmail}
                  onChange={(e) =>
                    setEmailDialog({ ...emailDialog, recipientEmail: e.target.value })
                  }
                  placeholder="client@example.com"
                />
              </div>
              {emailDialog.inspection && (
                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                  <p><strong>Clinic:</strong> {emailDialog.inspection.clinicName}</p>
                  <p><strong>Test Date:</strong> {new Date(emailDialog.inspection.inspectionDate).toLocaleDateString()}</p>
                  <p><strong>Status:</strong> {emailDialog.inspection.status}</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setEmailDialog({ open: false, inspection: null, recipientEmail: '', sending: false })}
              >
                Cancel
              </Button>
              <Button
                onClick={handleEmailReport}
                disabled={emailDialog.sending || !emailDialog.recipientEmail}
                className="bg-dental-blue hover:bg-dental-blue/90"
              >
                {emailDialog.sending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  )
}
