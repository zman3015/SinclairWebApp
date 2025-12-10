"use client"

import { useState, useEffect, useCallback } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  QrCode,
  Camera,
  Plus,
  Search,
  Printer,
  Download,
  CheckCircle,
  AlertTriangle,
  Wrench,
  FileText,
  ShoppingCart
} from "lucide-react"
import QRCode from "react-qr-code"
import Image from "next/image"
import { collection, addDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/contexts/AuthContext"

// Sample scanned equipment data (constant)
const sampleEquipment = {
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
  repairs: 3,
  qrCode: "MDL-649251-CCCZ"
}

export default function Scanner() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<"scan" | "generate" | "equipment-details">("scan")
  const [scannedData, setScannedData] = useState<typeof sampleEquipment | null>(null)
  const [generatedCode, setGeneratedCode] = useState<string>("")
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [scanError, setScanError] = useState<string>("")
  const [isSaving, setIsSaving] = useState(false)

  // Brand-specific models
  const brandModels: Record<string, string[]> = {
    "A-Dec": [
      "SC3PLUS, TWIN MOTOR, 1-3 USERS, 120V",
      "SC3PLUS, TWIN MOTOR, 1-3 USERS, 240V",
      "SC5PLUS, TRI MOTOR, 3-5 USERS, 120V",
      "SC5PLUS, TRI MOTOR, 3-5 USERS, 240V",
      "SC7PLUS, QUAD MOTOR, 5-7 USERS, 240V",
      "SC10PLUS, QUIN MOTOR, 7-10 USERS, 240V",
      "SC12PLUS, HEX MOTOR, 10-12 USERS, 240V",
      "DV5PLUS, DRY VACUUM, 1-5 USERS",
      "DV7PLUS, DRY VACUUM, 5-7 USERS",
      "DV10PLUS, DRY VACUUM, 7-10 USERS",
      "DV12PLUS, DRY VACUUM, 10-12 USERS",
      "311B Chair",
      "411 CHAIR",
      "511A CHAIR",
      "511B CHAIR"
    ],
    "Air Techniques": [],
    "BaseVac": [],
    "Belmont": [],
    "Biolase": [],
    "Carestream": [],
    "Coltene": [],
    "Dental EZ": [],
    "Dexis": [],
    "Forest Dental": [],
    "Midmark": [],
    "Scican": [],
    "VaTech": [],
    "W&H": []
  }

  // Sample equipment data
  // Database simulation for saved equipment
  const [savedEquipment, setSavedEquipment] = useState<Array<{
    code: string
    clinic: string
    serialNumber: string
    brand: string
    model: string
    purchaseDate: string
    warrantyExpiration: string
    dateCreated: string
    qrData: string
  }>>([
    {
      code: "MDL-649251-CCCZ",
      clinic: "Bright Smiles Dental",
      serialNumber: "AS500-2023-001",
      brand: "A-Dec",
      model: "SC5PLUS, TRI MOTOR, 3-5 USERS, 120V",
      purchaseDate: "2023-01-15",
      warrantyExpiration: "2025-01-15",
      dateCreated: "2023-08-18T10:30:00.000Z",
      qrData: "MDL-649251-CCCZ|Bright Smiles Dental|AS500-2023-001|A-Dec|SC5PLUS, TRI MOTOR, 3-5 USERS, 120V|2023-01-15|2025-01-15"
    },
    {
      code: "MDL-742859-XYZW",
      clinic: "Family Dental Care",
      serialNumber: "BL300-2023-002",
      brand: "Belmont",
      model: "Dental Chair Model X3",
      purchaseDate: "2023-02-20",
      warrantyExpiration: "2025-02-20",
      dateCreated: "2023-08-19T14:15:00.000Z",
      qrData: "MDL-742859-XYZW|Family Dental Care|BL300-2023-002|Belmont|Dental Chair Model X3|2023-02-20|2025-02-20"
    }
  ])

  const [equipmentForm, setEquipmentForm] = useState({
    clinic: "",
    serialNumber: "",
    brand: "",
    model: "",
    purchaseDate: "",
    warrantyExpiration: ""
  })

  // Get available models for selected brand
  const availableModels = equipmentForm.brand ? brandModels[equipmentForm.brand] || [] : []

  // Load equipment from Firestore on mount
  useEffect(() => {
    const loadEquipment = async () => {
      if (!user) return

      try {
        console.log("📡 Loading equipment from Firestore for user:", user.uid)
        // Filter equipment by current user
        const q = query(collection(db, "equipment"), where("createdBy", "==", user.uid))
        const equipmentSnapshot = await getDocs(q)
        const equipmentData = equipmentSnapshot.docs.map(doc => {
          const data = doc.data()
          return {
            code: data.code || "",
            clinic: data.clinic || "",
            serialNumber: data.serialNumber || "",
            brand: data.brand || "",
            model: data.model || "",
            purchaseDate: data.purchaseDate || "",
            warrantyExpiration: data.warrantyExpiration || "",
            dateCreated: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            qrData: data.qrData || ""
          }
        })

        setSavedEquipment(equipmentData)
        console.log(`✅ Loaded ${equipmentData.length} equipment items from Firestore`)
      } catch (error) {
        console.error("❌ Error loading equipment:", error)
      }
    }

    loadEquipment()
  }, [user])

  // Handle brand change - reset model when brand changes
  const handleBrandChange = (value: string) => {
    setEquipmentForm({
      ...equipmentForm,
      brand: value,
      model: "" // Reset model when brand changes
    })
  }

  // Save equipment to Firestore database
  const saveEquipmentToDatabase = async (code: string, qrData: string) => {
    try {
      setIsSaving(true)
      const newEquipment = {
        code,
        clinic: equipmentForm.clinic,
        serialNumber: equipmentForm.serialNumber,
        brand: equipmentForm.brand,
        model: equipmentForm.model,
        purchaseDate: equipmentForm.purchaseDate,
        warrantyExpiration: equipmentForm.warrantyExpiration,
        qrData,
        status: "Active",
        createdBy: user?.uid || "unknown",
        createdAt: serverTimestamp(),
        lastService: null,
        nextService: null,
        repairs: 0
      }

      // Save to Firestore
      const docRef = await addDoc(collection(db, "equipment"), newEquipment)
      console.log("✅ Equipment saved to Firestore with ID:", docRef.id)

      // Also add to local state for immediate display
      setSavedEquipment(prev => [...prev, {
        ...newEquipment,
        dateCreated: new Date().toISOString(),
      }])

      alert(`✅ Equipment saved successfully!\nEquipment Code: ${code}`)
    } catch (error) {
      console.error("❌ Error saving equipment:", error)
      alert(`Error saving equipment: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSaving(false)
    }
  }

  // Search equipment by code
  const [searchCode, setSearchCode] = useState("")
  const [searchResult, setSearchResult] = useState<typeof savedEquipment[0] | null>(null)
  const [showManualSearch, setShowManualSearch] = useState(false)
  const [manualSearchCode, setManualSearchCode] = useState("")
  const [detailedEquipment, setDetailedEquipment] = useState<typeof savedEquipment[0] | null>(null)

  const searchEquipment = () => {
    const found = savedEquipment.find(eq => eq.code.toLowerCase() === searchCode.toLowerCase())
    setSearchResult(found || null)
    if (!found && searchCode) {
      alert(`Equipment code "${searchCode}" not found in database`)
    }
  }

  const handleManualSearch = () => {
    if (!manualSearchCode.trim()) return

    const found = savedEquipment.find(eq => eq.code.toLowerCase() === manualSearchCode.toLowerCase())
    if (found) {
      // Convert found equipment to scannedData format
      setScannedData({
        id: found.code,
        clinic: found.clinic,
        serialNumber: found.serialNumber,
        brand: found.brand,
        model: found.model,
        purchaseDate: found.purchaseDate,
        warrantyExpiration: found.warrantyExpiration,
        lastService: "2023-07-20",
        nextService: "2023-10-20",
        status: "Active",
        repairs: 3,
        qrCode: found.code
      })
      setActiveTab("equipment-details")
      setShowManualSearch(false)
      setManualSearchCode("")
    } else {
      alert(`Equipment code "${manualSearchCode}" not found in database`)
    }
  }

  const handleScan = () => {
    setIsCameraActive(true)
    setScanError("")
  }

  const handleQRCodeScan = useCallback((data: string | null) => {
    if (data) {
      console.log("QR Code scanned:", data)

      // Look for equipment by QR code data
      const foundEquipment = savedEquipment.find(eq =>
        eq.qrData === data || eq.code === data || data.includes(eq.code)
      )

      if (foundEquipment) {
        // Convert found equipment to scannedData format
        setScannedData({
          id: foundEquipment.code,
          clinic: foundEquipment.clinic,
          serialNumber: foundEquipment.serialNumber,
          brand: foundEquipment.brand,
          model: foundEquipment.model,
          purchaseDate: foundEquipment.purchaseDate,
          warrantyExpiration: foundEquipment.warrantyExpiration,
          lastService: "2023-07-20",
          nextService: "2023-10-20",
          status: "Active",
          repairs: 3,
          qrCode: foundEquipment.code
        })
        setActiveTab("equipment-details")
        setIsCameraActive(false)
      } else {
        // Also check if it matches the sample equipment
        if (data.includes("DT-EQ-001") || data.includes("AS500-2023-001") || data.includes("A-Dec")) {
          setScannedData(sampleEquipment)
          setActiveTab("equipment-details")
          setIsCameraActive(false)
        } else {
          setScanError(`Equipment not found for QR code: ${data}`)
          setTimeout(() => setScanError(""), 3000)
        }
      }
    }
  }, [savedEquipment])

  const handleScanError = (error: Error) => {
    console.error("Scan error:", error)
    setScanError("Camera access denied or scanning failed. Please check permissions.")
  }

  // Camera and QR scanning logic
  useEffect(() => {
    let stream: MediaStream | null = null
    let scanning = false

    const startCamera = async () => {
      if (isCameraActive && !scanning) {
        scanning = true
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: "environment", // Use back camera if available
              width: { ideal: 640 },
              height: { ideal: 480 }
            }
          })

          const video = document.getElementById('qr-video') as HTMLVideoElement
          if (video) {
            video.srcObject = stream
            video.play()

            // Simple QR detection - check for patterns in video
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')

            const scanForQR = () => {
              if (!isCameraActive || !video.videoWidth) {
                return
              }

              canvas.width = video.videoWidth
              canvas.height = video.videoHeight
              ctx?.drawImage(video, 0, 0)

              // For demo purposes, we'll simulate finding QR codes
              // In a real app, you'd use a QR code detection library here
              // For now, let's add a manual trigger or simulate scanning after a delay

              setTimeout(scanForQR, 100) // Check every 100ms
            }

            video.addEventListener('loadedmetadata', scanForQR)
          }
        } catch (error) {
          console.error('Camera access error:', error)
          setScanError("Unable to access camera. Please check permissions.")
          setIsCameraActive(false)
          scanning = false
        }
      }
    }

    const stopCamera = () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
        stream = null
      }
      scanning = false
    }

    if (isCameraActive) {
      startCamera()
    } else {
      stopCamera()
    }

    return () => {
      stopCamera()
    }
  }, [isCameraActive])

  // Simulate QR code detection for demo
  useEffect(() => {
    if (isCameraActive) {
      // Simulate finding a QR code after 3 seconds for demo
      const demoTimeout = setTimeout(() => {
        if (isCameraActive) {
          // Simulate scanning the sample equipment
          handleQRCodeScan("MDL-649251-CCCZ|Bright Smiles Dental|AS500-2023-001|A-Dec|SC5PLUS, TRI MOTOR, 3-5 USERS, 120V|2023-01-15|2025-01-15")
        }
      }, 3000)

      return () => clearTimeout(demoTimeout)
    }
  }, [isCameraActive, handleQRCodeScan])

  const generateUniqueCode = () => {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substr(2, 4).toUpperCase()
    return `MDL-${timestamp.toString().slice(-6)}-${random}`
  }

  const generateQRCode = async () => {
    const { clinic, serialNumber, brand, model, purchaseDate, warrantyExpiration } = equipmentForm
    if (clinic && serialNumber && brand && model) {
      const uniqueCode = generateUniqueCode()
      const qrData = `${uniqueCode}|${clinic}|${serialNumber}|${brand}|${model}|${purchaseDate}|${warrantyExpiration}`
      setGeneratedCode(qrData)

      // Save to Firebase database
      await saveEquipmentToDatabase(uniqueCode, qrData)
    } else {
      alert("Please fill in all required fields: Clinic, Serial Number, Brand, and Model")
    }
  }

  const recentScans = [
    {
      id: "DT-EQ-001",
      equipment: "A-Dec 500 Chair",
      clinic: "Bright Smiles Dental",
      scanTime: "2 minutes ago",
      status: "Active"
    },
    {
      id: "DT-EQ-002",
      equipment: "Planmeca X-Ray Unit",
      clinic: "Family Dental Care",
      scanTime: "15 minutes ago",
      status: "Needs Service"
    }
  ]

  return (
    <MainLayout
      title="QR Code System"
      subtitle="Scan equipment or generate new QR codes for tracking"
    >
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <Button
            variant={activeTab === "scan" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("scan")}
            className={activeTab === "scan" ? "bg-dental-blue" : ""}
          >
            <Camera className="h-4 w-4 mr-2" />
            Scan Equipment
          </Button>
          <Button
            variant={activeTab === "generate" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("generate")}
            className={activeTab === "generate" ? "bg-dental-blue" : ""}
          >
            <QrCode className="h-4 w-4 mr-2" />
            Generate QR Code
          </Button>
          {scannedData && (
            <Button
              variant={activeTab === "equipment-details" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("equipment-details")}
              className={activeTab === "equipment-details" ? "bg-dental-blue" : ""}
            >
              <Search className="h-4 w-4 mr-2" />
              Equipment Details
            </Button>
          )}
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Main Scanner/Generator */}
          <div>
            {activeTab === "scan" && (
              <Card>
                <CardHeader>
                  <CardTitle>Scan Equipment QR Code</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Scanner Interface */}
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 relative overflow-hidden">
                      {isCameraActive ? (
                        <div className="w-full h-full relative">
                          <video
                            id="qr-video"
                            className="w-full h-full object-cover"
                            autoPlay
                            playsInline
                            muted
                          />
                          <div className="absolute inset-0 border-2 border-dental-yellow"></div>
                          <div className="absolute bottom-2 left-2 right-2">
                            <Button
                              onClick={() => setIsCameraActive(false)}
                              size="sm"
                              variant="outline"
                              className="w-full bg-white/90"
                            >
                              Stop Scanning
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500 mb-4">Point camera at QR code</p>
                          <Button onClick={handleScan} className="bg-dental-blue">
                            <Camera className="h-4 w-4 mr-2" />
                            Start Scanning
                          </Button>
                        </div>
                      )}
                    </div>

                    {scanError && (
                      <div className="text-red-600 text-sm text-center p-2 bg-red-50 rounded border border-red-200">
                        {scanError}
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowManualSearch(true)}
                      >
                        <Search className="h-4 w-4 mr-2" />
                        Manual Search
                      </Button>
                    </div>
                  </div>

                  {/* Scanned Result */}
                  {scannedData && (
                    <div className="border rounded-lg p-4 bg-green-50">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <h3 className="font-semibold text-green-800">Equipment Found</h3>
                        </div>
                        <Badge
                          variant={scannedData.status === "Active" ? "default" : "destructive"}
                          className={scannedData.status === "Active" ? "bg-green-100 text-green-800" : ""}
                        >
                          {scannedData.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-700">Equipment</p>
                          <p>{scannedData.brand} {scannedData.model}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Clinic</p>
                          <p>{scannedData.clinic}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Serial Number</p>
                          <p>{scannedData.serialNumber}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Last Service</p>
                          <p>{scannedData.lastService}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Next Service</p>
                          <p>{scannedData.nextService}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">Total Repairs</p>
                          <p>{scannedData.repairs}</p>
                        </div>
                      </div>

                      <div className="flex space-x-2 mt-4">
                        <Button size="sm" className="bg-dental-blue">
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          Start Repair
                        </Button>
                        <Button size="sm" variant="outline">
                          Service History
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Manual Search Modal */}
                  {showManualSearch && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white rounded-lg p-6 w-96 max-w-full">
                        <h3 className="text-lg font-semibold mb-4">Manual Equipment Search</h3>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="manualSearch">Equipment Code</Label>
                            <Input
                              id="manualSearch"
                              value={manualSearchCode}
                              onChange={(e) => setManualSearchCode(e.target.value)}
                              placeholder="Enter code (e.g., MDL-649251-CCCZ)"
                              className="mt-1"
                              onKeyPress={(e) => e.key === 'Enter' && handleManualSearch()}
                            />
                          </div>
                          <div className="flex space-x-2">
                            <Button onClick={handleManualSearch} className="bg-dental-blue flex-1">
                              <Search className="h-4 w-4 mr-2" />
                              Search
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setShowManualSearch(false)
                                setManualSearchCode("")
                              }}
                              className="flex-1"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}


                </CardContent>
              </Card>
            )}

            {activeTab === "generate" && (
              <Card>
                <CardHeader>
                  <CardTitle>Generate Equipment QR Code</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Equipment Registration Form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="clinic">Clinic Name/Account Number</Label>
                      <Input
                        id="clinic"
                        value={equipmentForm.clinic}
                        onChange={(e) => setEquipmentForm({...equipmentForm, clinic: e.target.value})}
                        placeholder="e.g., Bright Smiles Dental"
                      />
                    </div>
                    <div>
                      <Label htmlFor="serial">Serial Number</Label>
                      <Input
                        id="serial"
                        value={equipmentForm.serialNumber}
                        onChange={(e) => setEquipmentForm({...equipmentForm, serialNumber: e.target.value})}
                        placeholder="e.g., AS500-2023-001"
                      />
                    </div>
                    <div>
                      <Label htmlFor="brand">Brand/Make</Label>
                      <Select
                        value={equipmentForm.brand}
                        onValueChange={handleBrandChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a brand" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A-Dec">A-Dec</SelectItem>
                          <SelectItem value="Air Techniques">Air Techniques</SelectItem>
                          <SelectItem value="BaseVac">BaseVac</SelectItem>
                          <SelectItem value="Belmont">Belmont</SelectItem>
                          <SelectItem value="Biolase">Biolase</SelectItem>
                          <SelectItem value="Carestream">Carestream</SelectItem>
                          <SelectItem value="Coltene">Coltene</SelectItem>
                          <SelectItem value="Dental EZ">Dental EZ</SelectItem>
                          <SelectItem value="Dexis">Dexis</SelectItem>
                          <SelectItem value="Forest Dental">Forest Dental</SelectItem>
                          <SelectItem value="Midmark">Midmark</SelectItem>
                          <SelectItem value="Scican">Scican</SelectItem>
                          <SelectItem value="VaTech">VaTech</SelectItem>
                          <SelectItem value="W&H">W&H</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="model">Model</Label>
                      <Select
                        value={equipmentForm.model}
                        onValueChange={(value) => setEquipmentForm({...equipmentForm, model: value})}
                        disabled={!equipmentForm.brand}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={equipmentForm.brand ? "Select a model" : "Select brand first"} />
                        </SelectTrigger>
                        <SelectContent>
                          {availableModels.map((model) => (
                            <SelectItem key={model} value={model}>
                              {model}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="purchase">Purchase Date</Label>
                      <Input
                        id="purchase"
                        type="date"
                        value={equipmentForm.purchaseDate}
                        onChange={(e) => setEquipmentForm({...equipmentForm, purchaseDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="warranty">Warranty Expiration</Label>
                      <Input
                        id="warranty"
                        type="date"
                        value={equipmentForm.warrantyExpiration}
                        onChange={(e) => setEquipmentForm({...equipmentForm, warrantyExpiration: e.target.value})}
                      />
                    </div>
                  </div>

                  <Button
                    onClick={generateQRCode}
                    className="bg-dental-blue"
                    disabled={isSaving}
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    {isSaving ? "Saving..." : "Generate QR Code"}
                  </Button>

                  {/* Generated QR Code */}
                  {generatedCode && (
                    <div className="border rounded-lg p-6 text-center bg-gray-50">
                      <h3 className="font-semibold mb-4">Generated QR Code</h3>

                      {/* Company Logo */}
                      <div className="mb-4 flex justify-center">
                        <div className="flex items-center gap-2">
                          <Image
                            src="/sinclair-logo.jpg"
                            alt="Sinclair Dental"
                            width={180}
                            height={51}
                            className="h-auto w-auto max-h-[51px]"
                            priority
                            unoptimized
                          />
                        </div>
                      </div>

                      {/* QR Code */}
                      <div className="bg-white p-4 rounded-lg inline-block">
                        <QRCode value={generatedCode} size={200} />
                      </div>

                      {/* Unique Equipment Code */}
                      <div className="mt-4 p-3 bg-white rounded-lg border">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-gray-700">Equipment Code:</p>
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            ✓ Saved to Firebase
                          </Badge>
                        </div>
                        <p className="text-lg font-bold text-dental-blue">
                          {generatedCode.split('|')[0]}
                        </p>
                      </div>

                      {/* Equipment Details */}
                      <div className="mt-3 text-xs text-gray-500">
                        <p className="break-words">{equipmentForm.brand} {equipmentForm.model}</p>
                        <p>Serial: {equipmentForm.serialNumber}</p>
                      </div>

                      <div className="flex justify-center space-x-2 mt-4">
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline">
                          <Printer className="h-4 w-4 mr-2" />
                          Print Label
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === "equipment-details" && scannedData && (
              <div className="space-y-6">
                {/* Equipment Overview */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{scannedData?.brand} {scannedData?.model}</CardTitle>
                        <p className="text-sm text-gray-500">Serial: {scannedData?.serialNumber} • {scannedData?.clinic}</p>
                      </div>
                      <Badge
                        variant={scannedData?.status === "Active" ? "default" : "destructive"}
                        className={scannedData?.status === "Active" ? "bg-green-100 text-green-800" : ""}
                      >
                        {scannedData?.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Last Service</p>
                        <p className="text-lg">{scannedData?.lastService}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Next Service</p>
                        <p className="text-lg text-dental-blue font-medium">{scannedData?.nextService}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Total Repairs</p>
                        <p className="text-lg">{scannedData?.repairs}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Equipment ID</p>
                        <p className="text-lg font-mono text-dental-blue">{scannedData?.qrCode}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Tabs */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Previous Services */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Previous Services</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          {
                            date: "2023-07-20",
                            type: "Routine Maintenance",
                            technician: "John Doe",
                            cost: 125.00,
                            status: "Completed"
                          },
                          {
                            date: "2023-05-15",
                            type: "Emergency Repair",
                            technician: "John Doe",
                            cost: 485.00,
                            status: "Completed"
                          },
                          {
                            date: "2023-03-10",
                            type: "Warranty Service",
                            technician: "Sarah Smith",
                            cost: 0.00,
                            status: "Completed"
                          }
                        ].map((service, index) => {
                          const getServiceTypeColor = (type: string) => {
                            switch (type) {
                              case "Routine Maintenance":
                                return "bg-green-100 text-green-800 border-green-200"
                              case "Emergency Repair":
                                return "bg-red-100 text-red-800 border-red-200"
                              case "Warranty Service":
                                return "bg-blue-100 text-blue-800 border-blue-200"
                              case "Installation":
                                return "bg-purple-100 text-purple-800 border-purple-200"
                              case "Preventive":
                                return "bg-yellow-100 text-yellow-800 border-yellow-200"
                              default:
                                return "bg-gray-100 text-gray-800 border-gray-200"
                            }
                          }

                          return (
                          <div key={index} className="border rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <Badge
                                variant="outline"
                                className={getServiceTypeColor(service.type)}
                              >
                                {service.type}
                              </Badge>
                              <span className="text-lg font-bold text-dental-blue">
                                ${service.cost.toFixed(2)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{service.date}</p>
                            <p className="text-xs text-gray-500">Technician: {service.technician}</p>
                          </div>
                        )})}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Equipment Photos */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Equipment Photos</CardTitle>
                        <Button size="sm" variant="outline">
                          <Camera className="h-4 w-4 mr-2" />
                          Add Photo
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                            <div className="text-center">
                              <Camera className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                              <p className="text-xs text-gray-500">Photo {i}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Service Manuals & Parts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Service Manuals */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Service Manuals</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { title: "A-Dec 500 Service Manual", pages: 156, updated: "2023-01-01" },
                          { title: "Installation Guide", pages: 24, updated: "2022-12-15" },
                          { title: "Parts Catalog", pages: 89, updated: "2023-06-01" }
                        ].map((manual, index) => (
                          <div key={index} className="border rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-sm">{manual.title}</p>
                                <p className="text-xs text-gray-500">{manual.pages} pages • Updated: {manual.updated}</p>
                              </div>
                              <div className="flex space-x-1">
                                <Button size="sm" variant="outline">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Compatible Parts */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Compatible Parts</CardTitle>
                        <Button size="sm" className="bg-dental-blue">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Request Parts
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { name: "Hydraulic Pump Assembly", sku: "AD-500-HP-001", price: 385.00, stock: "In Stock" },
                          { name: "Control Panel", sku: "AD-500-CP-002", price: 275.00, stock: "Low Stock" },
                          { name: "Seal Kit", sku: "AD-500-SK-003", price: 45.00, stock: "In Stock" }
                        ].map((part, index) => (
                          <div key={index} className="border rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-sm">{part.name}</p>
                                <p className="text-xs text-gray-500">SKU: {part.sku}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold text-dental-blue">${part.price}</p>
                                <Badge
                                  variant={part.stock === "In Stock" ? "default" : "destructive"}
                                  className={part.stock === "In Stock" ? "bg-green-100 text-green-800 text-xs" : "text-xs"}
                                >
                                  {part.stock}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Action Buttons */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-wrap gap-3">
                      <Button className="bg-dental-blue">
                        <Wrench className="h-4 w-4 mr-2" />
                        Start New Service
                      </Button>
                      <Button variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        Create Invoice
                      </Button>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Print QR Code
                      </Button>
                      <Button variant="outline">
                        <Camera className="h-4 w-4 mr-2" />
                        Take Photos
                      </Button>
                      <Button variant="outline">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Order Parts
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>


        </div>
      </div>
    </MainLayout>
  )
}
