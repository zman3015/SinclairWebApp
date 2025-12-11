"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Upload,
  FileText,
  Search,
  Download,
  Eye,
  Filter,
  X,
  Plus,
  Calendar,
  Wrench
} from "lucide-react"

// Sample data - in production this would come from a database
const sampleManuals = [
  {
    id: "1",
    title: "A-Dec 500 Service Manual",
    make: "A-Dec",
    model: "500",
    year: "2023",
    category: "Dental Chair",
    fileSize: "12.5 MB",
    uploadDate: "2023-08-15",
    fileType: "PDF",
    pages: 145
  },
  {
    id: "2",
    title: "Planmeca ProMax 3D Installation Guide",
    make: "Planmeca",
    model: "ProMax 3D",
    year: "2022",
    category: "X-Ray",
    fileSize: "8.3 MB",
    uploadDate: "2023-07-20",
    fileType: "PDF",
    pages: 78
  },
  {
    id: "3",
    title: "Dentsply Midwest Handpiece Repair",
    make: "Dentsply",
    model: "Midwest Tradition",
    year: "2021",
    category: "Handpiece",
    fileSize: "4.2 MB",
    uploadDate: "2023-06-10",
    fileType: "PDF",
    pages: 32
  },
  {
    id: "4",
    title: "A-Dec 500 Chair Maintenance",
    make: "A-Dec",
    model: "500",
    year: "2023",
    category: "Dental Chair",
    fileSize: "6.8 MB",
    uploadDate: "2023-08-01",
    fileType: "PDF",
    pages: 56
  },
  {
    id: "5",
    title: "Belmont Clesta II Service Manual",
    make: "Belmont",
    model: "Clesta II",
    year: "2022",
    category: "Dental Chair",
    fileSize: "15.2 MB",
    uploadDate: "2023-05-15",
    fileType: "PDF",
    pages: 182
  }
]

const makes = ["All", "A-Dec", "Planmeca", "Dentsply", "Belmont", "Sirona", "KaVo"]
const categories = ["All", "Dental Chair", "X-Ray", "Handpiece", "Suction", "Compressor", "Sterilizer"]
const years = ["All", "2023", "2022", "2021", "2020", "2019", "2018"]

export default function ServiceManuals() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMake, setSelectedMake] = useState("All")
  const [selectedModel, setSelectedModel] = useState("")
  const [selectedYear, setSelectedYear] = useState("All")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    title: "",
    make: "",
    model: "",
    year: "",
    category: "",
    file: null as File | null
  })

  // Filter manuals based on selected filters
  const filteredManuals = sampleManuals.filter(manual => {
    const matchesSearch = manual.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         manual.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         manual.model.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesMake = selectedMake === "All" || manual.make === selectedMake
    const matchesModel = !selectedModel || manual.model.toLowerCase().includes(selectedModel.toLowerCase())
    const matchesYear = selectedYear === "All" || manual.year === selectedYear
    const matchesCategory = selectedCategory === "All" || manual.category === selectedCategory

    return matchesSearch && matchesMake && matchesModel && matchesYear && matchesCategory
  })

  const handleUpload = () => {
    // In production, this would upload to a server/database
    console.log("Uploading manual:", uploadForm)
    setUploadDialogOpen(false)
    // Reset form
    setUploadForm({
      title: "",
      make: "",
      model: "",
      year: "",
      category: "",
      file: null
    })
  }

  const clearFilters = () => {
    setSelectedMake("All")
    setSelectedModel("")
    setSelectedYear("All")
    setSelectedCategory("All")
    setSearchQuery("")
  }

  const activeFiltersCount = [
    selectedMake !== "All",
    selectedModel !== "",
    selectedYear !== "All",
    selectedCategory !== "All"
  ].filter(Boolean).length

  return (
    <MainLayout
      title="Service Manuals"
      subtitle="Access and manage equipment documentation"
    >
      <div className="space-y-6">
        {/* Header with Upload Button */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Equipment Manuals Library</h2>
            <p className="text-gray-600 mt-1">
              {filteredManuals.length} manual{filteredManuals.length !== 1 ? 's' : ''} found
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
                  Add a new service manual to the library with equipment details for easy searching.
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
                    <Label htmlFor="make">Make/Brand *</Label>
                    <Select value={uploadForm.make} onValueChange={(value) => setUploadForm({...uploadForm, make: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select make" />
                      </SelectTrigger>
                      <SelectContent>
                        {makes.filter(m => m !== "All").map(make => (
                          <SelectItem key={make} value={make}>{make}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="model">Model *</Label>
                    <Input
                      id="model"
                      placeholder="e.g., 500, ProMax 3D"
                      value={uploadForm.model}
                      onChange={(e) => setUploadForm({...uploadForm, model: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="year">Year *</Label>
                    <Select value={uploadForm.year} onValueChange={(value) => setUploadForm({...uploadForm, year: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.filter(y => y !== "All").map(year => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="category">Equipment Category *</Label>
                    <Select value={uploadForm.category} onValueChange={(value) => setUploadForm({...uploadForm, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.filter(c => c !== "All").map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="file">PDF File *</Label>
                    <Input
                      id="file"
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setUploadForm({...uploadForm, file: e.target.files?.[0] || null})}
                    />
                    <p className="text-sm text-gray-500 mt-1">Upload PDF files only (max 50MB)</p>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 mt-6">
                  <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    className="bg-dental-blue hover:bg-dental-blue/90"
                    onClick={handleUpload}
                    disabled={!uploadForm.title || !uploadForm.make || !uploadForm.model || !uploadForm.year || !uploadForm.category}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Manual
                  </Button>
                </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search by title, make, or model..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Make Filter */}
              <div>
                <Label htmlFor="filter-make">Make/Brand</Label>
                <Select value={selectedMake} onValueChange={setSelectedMake}>
                  <SelectTrigger id="filter-make">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {makes.map(make => (
                      <SelectItem key={make} value={make}>{make}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Model Filter */}
              <div>
                <Label htmlFor="filter-model">Model</Label>
                <Input
                  id="filter-model"
                  placeholder="Enter model..."
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                />
              </div>

              {/* Year Filter */}
              <div>
                <Label htmlFor="filter-year">Year</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger id="filter-year">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category Filter */}
              <div className="lg:col-span-5">
                <Label htmlFor="filter-category">Equipment Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger id="filter-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Manuals Grid */}
        {filteredManuals.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No manuals found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your filters or upload a new manual to get started.
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
                        <div className="flex items-center text-sm text-gray-600">
                          <Wrench className="h-3 w-3 mr-1" />
                          {manual.make} - {manual.model}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-3 w-3 mr-1" />
                          {manual.year}
                        </div>
                      </div>
                    </div>
                    <FileText className="h-8 w-8 text-dental-blue" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Badge className="bg-blue-100 text-blue-800">
                      {manual.category}
                    </Badge>

                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Size:</span> {manual.fileSize}
                      </div>
                      <div>
                        <span className="font-medium">Pages:</span> {manual.pages}
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium">Uploaded:</span> {manual.uploadDate}
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" className="flex-1 bg-dental-blue hover:bg-dental-blue/90">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}
