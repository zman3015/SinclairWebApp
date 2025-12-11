"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Wrench,
  Download,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Camera,
  FileText,
} from "lucide-react"
import QRCode from "react-qr-code"
import { useEquipment } from "@/lib/hooks/useEquipment"
import { useRepair } from "@/lib/hooks/useRepair"
import { useClient } from "@/lib/hooks/useClient"
import { usePhoto } from "@/lib/hooks/usePhoto"
import { useAuth } from "@/contexts/AuthContext"
import { PhotoGallery } from "@/components/photos/photo-gallery"
import { RepairPhotos } from "@/components/photos/repair-photos"
import type { RepairType, RepairStatus, CreateRepairInput, UpdateRepairInput } from "@/lib/models/repair"

export default function EquipmentDetails() {
  const params = useParams()
  const router = useRouter()
  const equipmentId = params.id as string

  const { equipment, loading: equipmentLoading, error: equipmentError } = useEquipment({ equipmentId })
  const { repairs, loading: repairsLoading, error: repairsError, create: createRepair, update: updateRepair } = useRepair({ equipmentId })
  const { client, loading: clientLoading } = useClient({ clientId: equipment?.clientId })
  const { user, userData } = useAuth()

  // Photo management
  const {
    photos,
    uploading: uploadingPhoto,
    uploadProgress,
    uploadEquipmentPhoto,
    deletePhoto
  } = usePhoto({ equipmentId, autoFetch: true })

  const [showStartRepair, setShowStartRepair] = useState(false)
  const [showUpdateRepair, setShowUpdateRepair] = useState(false)
  const [selectedRepair, setSelectedRepair] = useState<string | null>(null)
  const [showRepairPhotos, setShowRepairPhotos] = useState(false)
  const [repairPhotosId, setRepairPhotosId] = useState<string | null>(null)

  // New repair form state
  const [newRepair, setNewRepair] = useState<Partial<CreateRepairInput>>({
    type: 'Routine Maintenance',
    description: '',
    priority: 'Medium'
  })

  // Update repair form state
  const [repairUpdate, setRepairUpdate] = useState<Partial<UpdateRepairInput>>({})

  const handleStartRepair = async () => {
    if (!equipment || !equipment.id || !newRepair.description) return

    const repairData: CreateRepairInput = {
      equipmentId: equipment.id,
      equipmentName: `${equipment.manufacturer} ${equipment.model}`,
      clientId: equipment.clientId,
      clientName: equipment.clientName || client?.name,
      type: (newRepair.type || 'Routine Maintenance') as RepairType,
      status: 'Open',
      description: newRepair.description,
      priority: newRepair.priority as 'Low' | 'Medium' | 'High' | 'Critical',
      reportedDate: new Date(),
    }

    const created = await createRepair(repairData)
    if (created) {
      setShowStartRepair(false)
      setNewRepair({
        type: 'Routine Maintenance',
        description: '',
        priority: 'Medium'
      })
      window.location.reload()
    }
  }

  const handleUpdateRepairStatus = async () => {
    if (!selectedRepair) return

    const updated = await updateRepair(selectedRepair, repairUpdate)
    if (updated) {
      setShowUpdateRepair(false)
      setSelectedRepair(null)
      setRepairUpdate({})
      window.location.reload()
    }
  }

  const openUpdateDialog = (repairId: string, currentStatus: RepairStatus) => {
    setSelectedRepair(repairId)
    setRepairUpdate({ status: currentStatus })
    setShowUpdateRepair(true)
  }

  if (equipmentError) {
    return (
      <MainLayout title="Equipment Details" subtitle="Error loading equipment">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error Loading Equipment</h3>
              <p className="text-gray-500 mb-4">{equipmentError.message}</p>
              <Button onClick={() => router.push('/equipment')}>Back to Equipment</Button>
            </div>
          </CardContent>
        </Card>
      </MainLayout>
    )
  }

  if (equipmentLoading || !equipment) {
    return (
      <MainLayout title="Loading..." subtitle="">
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <Card className="lg:col-span-3">
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i}>
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-6 w-32" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-32 mx-auto" />
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    )
  }

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

  const getRepairStatusColor = (status: RepairStatus) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800'
      case 'In Progress':
        return 'bg-blue-100 text-blue-800'
      case 'Open':
        return 'bg-yellow-100 text-yellow-800'
      case 'Cancelled':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const qrValue = equipment.qrCode || `${equipment.id}-${equipment.serialNumber}`

  return (
    <MainLayout
      title={`${equipment.manufacturer} ${equipment.model}`}
      subtitle={`Serial: ${equipment.serialNumber} • ${equipment.clientName || 'Unknown Client'}`}
    >
      <div className="space-y-6">
        {/* Equipment Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-3">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Equipment Overview</CardTitle>
                <Badge className={getStatusColor(equipment.status)}>
                  {equipment.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Manufacturer</p>
                  <p className="text-lg">{equipment.manufacturer}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Model</p>
                  <p className="text-lg">{equipment.model}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Type</p>
                  <p className="text-lg">{equipment.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Condition</p>
                  <p className="text-lg">{equipment.condition || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Install Date</p>
                  <p className="text-lg">{equipment.installDate ? new Date(equipment.installDate).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Warranty</p>
                  <p className="text-lg">{equipment.warrantyExpiry ? new Date(equipment.warrantyExpiry).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Last Service</p>
                  <p className="text-lg">{equipment.lastService ? new Date(equipment.lastService).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Next Service</p>
                  <p className="text-lg text-dental-blue font-medium">
                    {equipment.nextService ? new Date(equipment.nextService).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Total Repairs</p>
                  <p className="text-lg">{repairs.length}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Client</p>
                  <p className="text-lg">{equipment.clientName || 'Unknown'}</p>
                </div>
                {equipment.roomNumber && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Room</p>
                    <p className="text-lg">{equipment.roomNumber}</p>
                  </div>
                )}
                {equipment.location && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Location</p>
                    <p className="text-lg">{equipment.location}</p>
                  </div>
                )}
              </div>
              {equipment.notes && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-medium text-gray-700 mb-1">Notes</p>
                  <p className="text-sm text-gray-600">{equipment.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* QR Code */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">QR Code</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="bg-white p-3 rounded-lg border inline-block">
                <QRCode value={qrValue} size={120} />
              </div>
              <div className="mt-3 space-y-2">
                <Button size="sm" variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  size="sm"
                  className="w-full bg-dental-blue"
                  onClick={() => setShowStartRepair(true)}
                >
                  <Wrench className="h-4 w-4 mr-2" />
                  Start Repair
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Information Tabs */}
        <Tabs defaultValue="history" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="history">Repair History</TabsTrigger>
            <TabsTrigger value="photos">Photos & Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Repair History ({repairs.length})</CardTitle>
                  <Button
                    className="bg-dental-blue"
                    onClick={() => setShowStartRepair(true)}
                  >
                    <Wrench className="h-4 w-4 mr-2" />
                    New Repair
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {repairsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="border rounded-lg p-4">
                        <Skeleton className="h-6 w-48 mb-3" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    ))}
                  </div>
                ) : repairsError ? (
                  <div className="text-center py-8">
                    <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
                    <p className="text-gray-500">Error loading repairs: {repairsError.message}</p>
                  </div>
                ) : repairs.length === 0 ? (
                  <div className="text-center py-12">
                    <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Repairs Yet</h3>
                    <p className="text-gray-500 mb-4">Start tracking repairs for this equipment</p>
                    <Button onClick={() => setShowStartRepair(true)} className="bg-dental-blue">
                      <Wrench className="h-4 w-4 mr-2" />
                      Start First Repair
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {repairs.map((repair) => (
                      <div key={repair.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{repair.type}</Badge>
                            <span className="text-sm text-gray-500">
                              {new Date(repair.reportedDate).toLocaleDateString()}
                            </span>
                            {repair.priority && (
                              <Badge variant="outline" className={
                                repair.priority === 'Critical' ? 'border-red-500 text-red-700' :
                                repair.priority === 'High' ? 'border-orange-500 text-orange-700' :
                                repair.priority === 'Medium' ? 'border-yellow-500 text-yellow-700' :
                                'border-gray-500 text-gray-700'
                              }>
                                {repair.priority}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            {repair.totalCost !== undefined && repair.totalCost > 0 && (
                              <span className="text-lg font-bold text-dental-blue">
                                ${repair.totalCost.toFixed(2)}
                              </span>
                            )}
                            <Badge className={getRepairStatusColor(repair.status)}>
                              {repair.status}
                            </Badge>
                          </div>
                        </div>

                        <p className="text-gray-700 mb-3">{repair.description}</p>
                        {repair.workPerformed && (
                          <p className="text-sm text-gray-600 mb-3">
                            <span className="font-medium">Work Performed:</span> {repair.workPerformed}
                          </p>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                          {repair.technicianName && (
                            <div>
                              <p className="font-medium text-gray-700">Technician</p>
                              <p>{repair.technicianName}</p>
                            </div>
                          )}
                          {repair.partsUsed && repair.partsUsed.length > 0 && (
                            <div>
                              <p className="font-medium text-gray-700">Parts Used</p>
                              <p>{repair.partsUsed.map(p => p.name).join(', ')}</p>
                            </div>
                          )}
                          {repair.completedDate && (
                            <div>
                              <p className="font-medium text-gray-700">Completed</p>
                              <p>{new Date(repair.completedDate).toLocaleDateString()}</p>
                            </div>
                          )}
                        </div>

                        {repair.notes && (
                          <div className="text-sm bg-gray-50 p-3 rounded mb-3">
                            <p className="font-medium text-gray-700 mb-1">Notes</p>
                            <p className="text-gray-600">{repair.notes}</p>
                          </div>
                        )}

                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setRepairPhotosId(repair.id!)
                              setShowRepairPhotos(true)
                            }}
                          >
                            <Camera className="h-4 w-4 mr-2" />
                            Photos
                          </Button>
                          {repair.status !== 'Completed' && repair.status !== 'Cancelled' && repair.id && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openUpdateDialog(repair.id!, repair.status)}
                            >
                              Update Status
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="photos" className="space-y-4">
            <PhotoGallery
              photos={photos}
              title="Equipment Photos"
              uploading={uploadingPhoto}
              uploadProgress={uploadProgress}
              canUpload={userData?.role === 'admin' || userData?.role === 'tech'}
              canDelete={userData?.role === 'admin' || userData?.role === 'tech'}
              onUpload={async (file) => {
                if (!user || !userData) {
                  throw new Error('You must be logged in to upload photos')
                }
                await uploadEquipmentPhoto(file, user.uid, userData.displayName || user.email || 'Unknown')
              }}
              onDelete={async (photoId) => {
                await deletePhoto(photoId)
              }}
              emptyMessage="No equipment photos yet. Upload photos to document equipment condition and installations."
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Start Repair Dialog */}
      <Dialog open={showStartRepair} onOpenChange={setShowStartRepair}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start New Repair</DialogTitle>
            <DialogDescription>
              Create a new repair record for {equipment.manufacturer} {equipment.model}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="type">Repair Type</Label>
              <Select
                value={newRepair.type}
                onValueChange={(value) => setNewRepair({ ...newRepair, type: value as RepairType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Routine Maintenance">Routine Maintenance</SelectItem>
                  <SelectItem value="Emergency Repair">Emergency Repair</SelectItem>
                  <SelectItem value="Warranty Service">Warranty Service</SelectItem>
                  <SelectItem value="Preventive">Preventive</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={newRepair.priority}
                onValueChange={(value) => setNewRepair({ ...newRepair, priority: value as 'Low' | 'Medium' | 'High' | 'Critical' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the issue or maintenance needed..."
                value={newRepair.description}
                onChange={(e) => setNewRepair({ ...newRepair, description: e.target.value })}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStartRepair(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleStartRepair}
              disabled={!newRepair.description}
              className="bg-dental-blue"
            >
              Create Repair
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Repair Dialog */}
      <Dialog open={showUpdateRepair} onOpenChange={setShowUpdateRepair}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Repair Status</DialogTitle>
            <DialogDescription>
              Update the status and add notes to this repair
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={repairUpdate.status}
                onValueChange={(value) => setRepairUpdate({ ...repairUpdate, status: value as RepairStatus })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="workPerformed">Work Performed</Label>
              <Textarea
                id="workPerformed"
                placeholder="Describe the work that was done..."
                value={repairUpdate.workPerformed || ''}
                onChange={(e) => setRepairUpdate({ ...repairUpdate, workPerformed: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional notes..."
                value={repairUpdate.notes || ''}
                onChange={(e) => setRepairUpdate({ ...repairUpdate, notes: e.target.value })}
                rows={2}
              />
            </div>
            {repairUpdate.status === 'Completed' && (
              <div>
                <Label htmlFor="laborCost">Labor Cost ($)</Label>
                <Input
                  id="laborCost"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={repairUpdate.laborCost || ''}
                  onChange={(e) => setRepairUpdate({
                    ...repairUpdate,
                    laborCost: parseFloat(e.target.value) || 0,
                    completedDate: new Date()
                  })}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUpdateRepair(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateRepairStatus}
              className="bg-dental-blue"
            >
              Update Repair
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Repair Photos Dialog */}
      <RepairPhotosDialog
        open={showRepairPhotos}
        onOpenChange={setShowRepairPhotos}
        repairId={repairPhotosId}
        canUpload={userData?.role === 'admin' || userData?.role === 'tech'}
        canDelete={userData?.role === 'admin' || userData?.role === 'tech'}
      />
    </MainLayout>
  )
}

// Repair Photos Dialog Component
function RepairPhotosDialog({
  open,
  onOpenChange,
  repairId,
  canUpload,
  canDelete
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  repairId: string | null
  canUpload: boolean
  canDelete: boolean
}) {
  const { user, userData } = useAuth()
  const {
    beforePhotos,
    afterPhotos,
    uploading,
    uploadProgress,
    uploadRepairPhoto,
    deletePhoto
  } = usePhoto({ repairId: repairId || undefined, autoFetch: !!repairId })

  if (!repairId) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Repair Photos</DialogTitle>
          <DialogDescription>
            Upload before and after photos to document the repair work
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <RepairPhotos
            beforePhotos={beforePhotos}
            afterPhotos={afterPhotos}
            uploading={uploading}
            uploadProgress={uploadProgress}
            canUpload={canUpload}
            canDelete={canDelete}
            onUploadBefore={async (file: File) => {
              if (!user || !userData) {
                throw new Error('You must be logged in to upload photos')
              }
              await uploadRepairPhoto(file, user.uid, userData.displayName || user.email || 'Unknown', true)
            }}
            onUploadAfter={async (file: File) => {
              if (!user || !userData) {
                throw new Error('You must be logged in to upload photos')
              }
              await uploadRepairPhoto(file, user.uid, userData.displayName || user.email || 'Unknown', false)
            }}
            onDelete={async (photoId: string) => {
              await deletePhoto(photoId)
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
