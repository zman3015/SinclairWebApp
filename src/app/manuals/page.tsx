"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Upload,
  FileText,
  Search,
  Download,
  Eye,
  Filter,
  X,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader2
} from "lucide-react"
import { useManuals } from "@/lib/hooks/useManual"
import type { ManualType } from "@/lib/models/manual"

const MANUAL_TYPES: ManualType[] = [
  'Service Manual',
  'User Guide',
  'Installation Guide',
  'Quick Reference',
  'Safety Guide',
  'Parts Catalog'
]

export default function ServiceManuals() {
  const {
    manuals,
    loading,
    error: loadError,
    uploading,
    uploadManual,
    deleteManual,
    trackDownload
  } = useManuals()

  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<ManualType | "all">("all")
  const [manufacturerFilter, setManufacturerFilter] = useState("all")
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [manualToDelete, setManualToDelete] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<string>("")

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    title: "",
    type: "Service Manual" as ManualType,
    manufacturer: "",
    model: "",
    description: "",
    tags: "",
    file: null as File | null
  })

  // Get unique manufacturers from manuals
  const manufacturers = Array.from(new Set(manuals.map(m => m.manufacturer))).sort()

  // Filter manuals
  const filteredManuals = manuals.filter(manual => {
    const matchesSearch =
      manual.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      manual.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      manual.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      manual.description?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = typeFilter === "all" || manual.type === typeFilter
    const matchesManufacturer = manufacturerFilter === "all" || manual.manufacturer === manufacturerFilter

    return matchesSearch && matchesType && matchesManufacturer
  })

  const handleUpload = async () => {
    if (!uploadForm.file || !uploadForm.title || !uploadForm.manufacturer) {
      return
    }

    setUploadProgress("Uploading file...")

    const tags = uploadForm.tags
      ? uploadForm.tags.split(',').map(t => t.trim()).filter(Boolean)
      : []

    const result = await uploadManual(
      uploadForm.file,
      {
        title: uploadForm.title,
        type: uploadForm.type,
        manufacturer: uploadForm.manufacturer,
        model: uploadForm.model || undefined,
        description: uploadForm.description || undefined,
        tags: tags.length > 0 ? tags : undefined,
        status: 'Active'
      }
    )

    if (result) {
      setUploadProgress("Upload successful!")
      setTimeout(() => {
        setUploadDialogOpen(false)
        setUploadProgress("")
        // Reset form
        setUploadForm({
          title: "",
          type: "Service Manual",
          manufacturer: "",
          model: "",
          description: "",
          tags: "",
          file: null
        })
      }, 1000)
    } else {
      setUploadProgress("")
    }
  }

  const handleDelete = async () => {
    if (!manualToDelete) return

    const success = await deleteManual(manualToDelete)
    if (success) {
      setDeleteDialogOpen(false)
      setManualToDelete(null)
    }
  }

  const handlePreview = async (manual: { id?: string; downloadURL: string }) => {
    if (manual.id) {
      await trackDownload(manual.id)
    }
    window.open(manual.downloadURL, '_blank')
  }

  const handleDownload = async (manual: { id?: string; downloadURL: string; fileName: string }) => {
    if (manual.id) {
      await trackDownload(manual.id)
    }
    // Create download link
    const link = document.createElement('a')
    link.href = manual.downloadURL
    link.download = manual.fileName
    link.click()
  }

  const clearFilters = () => {
    setTypeFilter("all")
    setManufacturerFilter("all")
    setSearchQuery("")
  }

  const activeFiltersCount = [
    typeFilter !== "all",
    manufacturerFilter !== "all",
    searchQuery !== ""
  ].filter(Boolean).length

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  if (loadError) {
    return (
      <MainLayout title="Service Manuals" subtitle="Access and manage equipment documentation">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error Loading Manuals</h3>
              <p className="text-gray-500 mb-4">{loadError.message}</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          </CardContent>
        </Card>
      </MainLayout>
    )
  }

  return (
    <MainLayout
      title="Service Manuals"
      subtitle="Access and manage equipment documentation"
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Total Manuals</p>
                <p className="text-3xl font-bold text-dental-blue mt-2">{manuals.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Service Manuals</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {manuals.filter(m => m.type === 'Service Manual').length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">User Guides</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {manuals.filter(m => m.type === 'User Guide').length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Total Downloads</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {manuals.reduce((sum, m) => sum + (m.downloadCount || 0), 0)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Header with Upload Button */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Equipment Manuals Library</h2>
            <p className="text-gray-600 mt-1">
              {loading ? 'Loading...' : `${filteredManuals.length} manual${filteredManuals.length !== 1 ? 's' : ''} found`}
            </p>
          </div>

          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-dental-blue hover:bg-dental-blue/90">
                <Upload className="h-4 w-4 mr-2" />
                Upload Manual
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Upload Service Manual</DialogTitle>
                <DialogDescription>
                  Upload a PDF manual to the library. Files are securely stored in Firebase Storage.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="title">Manual Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., A-Dec 500 Service Manual"
                      value={uploadForm.title}
                      onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="type">Manual Type *</Label>
                    <Select
                      value={uploadForm.type}
                      onValueChange={(value) => setUploadForm({...uploadForm, type: value as ManualType})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MANUAL_TYPES.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="manufacturer">Manufacturer *</Label>
                    <Input
                      id="manufacturer"
                      placeholder="e.g., A-Dec, Planmeca"
                      value={uploadForm.manufacturer}
                      onChange={(e) => setUploadForm({...uploadForm, manufacturer: e.target.value})}
                    />
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="model">Model</Label>
                    <Input
                      id="model"
                      placeholder="e.g., 500, ProMax 3D (optional)"
                      value={uploadForm.model}
                      onChange={(e) => setUploadForm({...uploadForm, model: e.target.value})}
                    />
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Brief description of the manual content (optional)"
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                      rows={2}
                    />
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      placeholder="Comma-separated tags (e.g., chair, x-ray, installation)"
                      value={uploadForm.tags}
                      onChange={(e) => setUploadForm({...uploadForm, tags: e.target.value})}
                    />
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="file">PDF File *</Label>
                    <Input
                      id="file"
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={(e) => setUploadForm({...uploadForm, file: e.target.files?.[0] || null})}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {uploadForm.file
                        ? `Selected: ${uploadForm.file.name} (${formatFileSize(uploadForm.file.size)})`
                        : 'Upload PDF files only (max 50MB)'}
                    </p>
                  </div>
                </div>

                {loadError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center text-red-800">
                    <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                    <p className="text-sm">{(loadError as { message: string }).message}</p>
                  </div>
                )}

                {uploadProgress && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center text-blue-800">
                    {uploading ? (
                      <Loader2 className="h-4 w-4 mr-2 flex-shrink-0 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                    )}
                    <p className="text-sm">{uploadProgress}</p>
                  </div>
                )}

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setUploadDialogOpen(false)
                      setUploadProgress("")
                    }}
                    disabled={uploading}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-dental-blue hover:bg-dental-blue/90"
                    onClick={handleUpload}
                    disabled={!uploadForm.title || !uploadForm.manufacturer || !uploadForm.file || uploading}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Manual
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Filter className="h-5 w-5 mr-2 text-dental-blue" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 bg-dental-yellow text-gray-900">
                    {activeFiltersCount} active
                  </Badge>
                )}
              </CardTitle>
              {activeFiltersCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div>
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search manuals..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Type Filter */}
              <div>
                <Label htmlFor="filter-type">Manual Type</Label>
                <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as ManualType | "all")}>
                  <SelectTrigger id="filter-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {MANUAL_TYPES.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Manufacturer Filter */}
              <div>
                <Label htmlFor="filter-manufacturer">Manufacturer</Label>
                <Select value={manufacturerFilter} onValueChange={setManufacturerFilter}>
                  <SelectTrigger id="filter-manufacturer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Manufacturers</SelectItem>
                    {manufacturers.map(manufacturer => (
                      <SelectItem key={manufacturer} value={manufacturer}>{manufacturer}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Manuals Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-24" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                    <div className="flex space-x-2">
                      <Skeleton className="h-9 flex-1" />
                      <Skeleton className="h-9 flex-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredManuals.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No manuals found</h3>
              <p className="text-gray-600 mb-4">
                {manuals.length === 0
                  ? "Get started by uploading your first manual."
                  : "Try adjusting your filters or upload a new manual."}
              </p>
              <Button
                className="bg-dental-blue hover:bg-dental-blue/90"
                onClick={() => setUploadDialogOpen(true)}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Manual
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredManuals.map((manual) => (
              <Card key={manual.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{manual.title}</CardTitle>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600 font-medium">
                          {manual.manufacturer}
                          {manual.model && ` - ${manual.model}`}
                        </p>
                        {manual.description && (
                          <p className="text-sm text-gray-500 line-clamp-2">
                            {manual.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <FileText className="h-8 w-8 text-dental-blue flex-shrink-0" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-blue-100 text-blue-800">
                        {manual.type}
                      </Badge>
                      {manual.tags?.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Size:</span> {formatFileSize(manual.fileSize)}
                      </div>
                      {manual.downloadCount !== undefined && manual.downloadCount > 0 && (
                        <div>
                          <span className="font-medium">Downloads:</span> {manual.downloadCount}
                        </div>
                      )}
                      <div className="col-span-2">
                        <span className="font-medium">Uploaded:</span>{' '}
                        {new Date(manual.uploadedAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handlePreview(manual)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 bg-dental-blue hover:bg-dental-blue/90"
                        onClick={() => handleDownload(manual)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          setManualToDelete(manual.id || null)
                          setDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Manual</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this manual? This will permanently delete the file from storage
              and remove the record from the database. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setManualToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  )
}
