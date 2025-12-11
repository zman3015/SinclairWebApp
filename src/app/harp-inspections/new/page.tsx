"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import {
  HarpTestType,
  XrayType,
  ImageType
} from "@/lib/harp-types"
import { Loader2, Plus, Trash2 } from "lucide-react"

// Form validation schema
const harpFormSchema = z.object({
  testType: z.string().min(1, "Test type is required"),
  xrayTypes: z.array(z.string()).min(1, "At least one X-ray type is required"),
  clinicName: z.string().min(1, "Clinic name is required"),
  clinicAddress: z.string().min(1, "Address is required"),
  clinicPhone: z.string().min(1, "Phone is required"),
  accountNumber: z.string().min(1, "Account number is required"),
  roomNumber: z.string().min(1, "Room number is required"),
  inspectionDate: z.string().min(1, "Inspection date is required"),
  technicianName: z.string().min(1, "Technician name is required"),
  technicianDate: z.string().min(1, "Technician date is required"),

  equipmentMake: z.string().min(1, "Equipment make is required"),
  equipmentModel: z.string().min(1, "Equipment model is required"),
  controlSerial: z.string().min(1, "Control serial is required"),
  tubeSerial: z.string().min(1, "Tube serial is required"),
  xrisNumber: z.string().min(1, "XRIS number is required"),
  imageType: z.string().min(1, "Image type is required"),

  items1to12: z.array(z.object({
    id: z.number(),
    label: z.string(),
    result: z.string().nullable(),
  })),

  techniqueRows: z.array(z.object({
    id: z.string(),
    sourceToConeDistance: z.string(),
    setKv: z.string(),
    setMa: z.string(),
    setTime: z.string(),
    measuredKvp: z.string(),
    measuredTime: z.string(),
    outputMr: z.string(),
    peeAverageMr: z.string(),
  })),
  notes: z.string(),

  items13to17: z.array(z.object({
    id: z.number(),
    label: z.string(),
    result: z.string().nullable(),
  })),
  item18KvCheck: z.string().nullable(),
  item19TimeCheck: z.string().nullable(),
  item20HarpSpec: z.string().nullable(),
  peeKv: z.string(),
  peeMa: z.string(),
  peeSec: z.string(),
  beamAlignment: z.string(),

  halfValueLayer: z.object({
    kV: z.string(),
    mA: z.string(),
    time: z.string(),
    totalFiltrationMmAl: z.string(),
    measuredHvlMm: z.string(),
    requiredHvlMm: z.string(),
    mR: z.string(),
  }),
})

type FormData = z.infer<typeof harpFormSchema>

const defaultItems1to12 = [
  { id: 1, label: 'Line "ON" indicator', result: null },
  { id: 2, label: 'X-ray "ON" indicator', result: null },
  { id: 3, label: 'Multiple tube indicators', result: null },
  { id: 4, label: 'Line voltage compensator', result: null },
  { id: 5, label: 'kV / mA / Technique indication', result: null },
  { id: 6, label: 'Tube head leakage', result: null },
  { id: 7, label: 'Tube head stability', result: null },
  { id: 8, label: 'Interlocks', result: null },
  { id: 9, label: 'Labels', result: null },
  { id: 10, label: 'Warning Signs', result: null },
  { id: 11, label: 'Exposure Switch', result: null },
  { id: 12, label: 'kVp accuracy', result: null },
]

const defaultItems13to17 = [
  { id: 13, label: 'H-V-L (Filtration)', result: null },
  { id: 14, label: 'Collimation pan', result: null },
  { id: 15, label: 'Patient exposure entrance', result: null },
  { id: 16, label: 'Output reproducibility', result: null },
  { id: 17, label: 'Timer: (mech/elect)', result: null },
]

export default function NewHarpInspectionPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(harpFormSchema),
    defaultValues: {
      testType: "",
      xrayTypes: [],
      clinicName: "",
      clinicAddress: "",
      clinicPhone: "",
      accountNumber: "",
      roomNumber: "",
      inspectionDate: "",
      technicianName: "",
      technicianDate: "",
      equipmentMake: "",
      equipmentModel: "",
      controlSerial: "",
      tubeSerial: "",
      xrisNumber: "",
      imageType: "",
      items1to12: defaultItems1to12,
      techniqueRows: [{
        id: Math.random().toString(),
        sourceToConeDistance: "",
        setKv: "",
        setMa: "",
        setTime: "",
        measuredKvp: "",
        measuredTime: "",
        outputMr: "",
        peeAverageMr: "",
      }],
      notes: "",
      items13to17: defaultItems13to17,
      item18KvCheck: "",
      item19TimeCheck: "",
      item20HarpSpec: "",
      peeKv: "",
      peeMa: "",
      peeSec: "",
      beamAlignment: "",
      halfValueLayer: {
        kV: "",
        mA: "",
        time: "",
        totalFiltrationMmAl: "",
        measuredHvlMm: "",
        requiredHvlMm: "",
        mR: "",
      },
    },
  })

  const watchXrayTypes = watch("xrayTypes")
  const watchItems1to12 = watch("items1to12")
  const watchItems13to17 = watch("items13to17")
  const watchTechniqueRows = watch("techniqueRows")

  const toggleXrayType = (type: XrayType) => {
    const current = watchXrayTypes || []
    if (current.includes(type)) {
      setValue("xrayTypes", current.filter((t) => t !== type))
    } else {
      setValue("xrayTypes", [...current, type])
    }
  }

  const toggleMsNi = (itemIndex: number, field: "items1to12" | "items13to17") => {
    const items = field === "items1to12" ? watchItems1to12 : watchItems13to17
    const current = items[itemIndex].result
    const newResult = current === "MS" ? "NI" : current === "NI" ? null : "MS"
    setValue(`${field}.${itemIndex}.result`, newResult)
  }

  const addTechniqueRow = () => {
    setValue("techniqueRows", [
      ...watchTechniqueRows,
      {
        id: Math.random().toString(),
        sourceToConeDistance: "",
        setKv: "",
        setMa: "",
        setTime: "",
        measuredKvp: "",
        measuredTime: "",
        outputMr: "",
        peeAverageMr: "",
      },
    ])
  }

  const removeTechniqueRow = (index: number) => {
    if (watchTechniqueRows.length > 1) {
      setValue(
        "techniqueRows",
        watchTechniqueRows.filter((_, i) => i !== index)
      )
    }
  }

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/harp-inspection/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Failed to generate PDF")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `HARP-Inspection-${data.accountNumber}-${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      alert("PDF generated successfully!")
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to generate PDF. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  return (
    <MainLayout title="HARP X-Ray Inspection" subtitle="New Inspection Form">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-5xl mx-auto">
        {/* Step Progress */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      currentStep === step
                        ? "bg-blue-600 text-white"
                        : currentStep > step
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step}
                  </div>
                  {step < 5 && (
                    <div
                      className={`w-12 h-1 mx-2 ${
                        currentStep > step ? "bg-green-600" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span>Test Setup</span>
              <span>Equipment</span>
              <span>Items 1-12</span>
              <span>Parameters</span>
              <span>Final Items</span>
            </div>
          </CardContent>
        </Card>

        {/* Step 1: Test Setup */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Test Setup</CardTitle>
              <CardDescription>Basic information about the inspection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Test Type */}
              <div>
                <Label className="mb-3 block font-semibold">Test Type *</Label>
                <RadioGroup
                  value={watch("testType") || ""}
                  onValueChange={(value) => setValue("testType", value as HarpTestType)}
                >
                  <div className="flex flex-wrap gap-4">
                    {["HARP QA", "New Install", "Acceptance Test", "Plans Approved", "Replacement"].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <RadioGroupItem value={type} id={type} />
                        <Label htmlFor={type} className="cursor-pointer font-normal">{type}</Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
                {errors.testType && (
                  <p className="text-red-600 text-sm mt-1">{errors.testType.message}</p>
                )}
              </div>

              {/* X-ray Types */}
              <div>
                <Label className="mb-3 block font-semibold">X-ray Type *</Label>
                <div className="flex flex-wrap gap-4">
                  {(["Intra-oral", "Pan", "Ceph", "CT"] as XrayType[]).map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={type}
                        checked={watchXrayTypes?.includes(type)}
                        onCheckedChange={() => toggleXrayType(type)}
                      />
                      <Label htmlFor={type} className="cursor-pointer font-normal">{type}</Label>
                    </div>
                  ))}
                </div>
                {errors.xrayTypes && (
                  <p className="text-red-600 text-sm mt-1">{errors.xrayTypes.message}</p>
                )}
              </div>

              {/* Clinic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clinicName">Clinic Name *</Label>
                  <Input id="clinicName" {...register("clinicName")} />
                  {errors.clinicName && (
                    <p className="text-red-600 text-sm mt-1">{errors.clinicName.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="clinicPhone">Phone *</Label>
                  <Input id="clinicPhone" {...register("clinicPhone")} />
                  {errors.clinicPhone && (
                    <p className="text-red-600 text-sm mt-1">{errors.clinicPhone.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="clinicAddress">Address *</Label>
                <Input id="clinicAddress" {...register("clinicAddress")} />
                {errors.clinicAddress && (
                  <p className="text-red-600 text-sm mt-1">{errors.clinicAddress.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="accountNumber">Account Number *</Label>
                  <Input id="accountNumber" {...register("accountNumber")} />
                  {errors.accountNumber && (
                    <p className="text-red-600 text-sm mt-1">{errors.accountNumber.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="roomNumber">Room Number *</Label>
                  <Input id="roomNumber" {...register("roomNumber")} />
                  {errors.roomNumber && (
                    <p className="text-red-600 text-sm mt-1">{errors.roomNumber.message}</p>
                  )}
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="inspectionDate">Inspection Date *</Label>
                  <Input id="inspectionDate" type="date" {...register("inspectionDate")} />
                  {errors.inspectionDate && (
                    <p className="text-red-600 text-sm mt-1">{errors.inspectionDate.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="technicianName">Technician Name *</Label>
                  <Input id="technicianName" {...register("technicianName")} />
                  {errors.technicianName && (
                    <p className="text-red-600 text-sm mt-1">{errors.technicianName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="technicianDate">Technician Date *</Label>
                <Input id="technicianDate" type="date" {...register("technicianDate")} />
                {errors.technicianDate && (
                  <p className="text-red-600 text-sm mt-1">{errors.technicianDate.message}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Equipment Info */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Equipment Information</CardTitle>
              <CardDescription>Details about the X-ray equipment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="equipmentMake">Equipment Make *</Label>
                  <Input id="equipmentMake" {...register("equipmentMake")} />
                  {errors.equipmentMake && (
                    <p className="text-red-600 text-sm mt-1">{errors.equipmentMake.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="equipmentModel">Equipment Model *</Label>
                  <Input id="equipmentModel" {...register("equipmentModel")} />
                  {errors.equipmentModel && (
                    <p className="text-red-600 text-sm mt-1">{errors.equipmentModel.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="controlSerial">Control Serial # *</Label>
                  <Input id="controlSerial" {...register("controlSerial")} />
                  {errors.controlSerial && (
                    <p className="text-red-600 text-sm mt-1">{errors.controlSerial.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="tubeSerial">Tube Serial # *</Label>
                  <Input id="tubeSerial" {...register("tubeSerial")} />
                  {errors.tubeSerial && (
                    <p className="text-red-600 text-sm mt-1">{errors.tubeSerial.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="xrisNumber">XRIS # *</Label>
                <Input id="xrisNumber" {...register("xrisNumber")} />
                {errors.xrisNumber && (
                  <p className="text-red-600 text-sm mt-1">{errors.xrisNumber.message}</p>
                )}
              </div>

              <div>
                <Label className="mb-3 block font-semibold">Image Type *</Label>
                <RadioGroup
                  value={watch("imageType") || ""}
                  onValueChange={(value) => setValue("imageType", value as ImageType)}
                >
                  <div className="flex flex-wrap gap-4">
                    {["Film", "Digital", "Phosphor Plate"].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <RadioGroupItem value={type} id={`image-${type}`} />
                        <Label htmlFor={`image-${type}`} className="cursor-pointer font-normal">{type}</Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
                {errors.imageType && (
                  <p className="text-red-600 text-sm mt-1">{errors.imageType.message}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Items 1-12 */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 3: Inspection Items 1-12</CardTitle>
              <CardDescription>Mark each item as MS (Meets Specifications) or NI (Needs Improvement)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {watchItems1to12?.map((item, index) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <span className="text-sm">
                      {item.id}. {item.label}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={item.result === "MS" ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleMsNi(index, "items1to12")}
                        className={item.result === "MS" ? "bg-green-600 hover:bg-green-700" : ""}
                      >
                        MS
                      </Button>
                      <Button
                        type="button"
                        variant={item.result === "NI" ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleMsNi(index, "items1to12")}
                        className={item.result === "NI" ? "bg-red-600 hover:bg-red-700" : ""}
                      >
                        NI
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Test Parameters */}
        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 4: Test Parameters and Results</CardTitle>
              <CardDescription>Enter technique factors and measured values</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-xs">Distance</th>
                      <th className="border p-2 text-xs">Set kV</th>
                      <th className="border p-2 text-xs">Set mA</th>
                      <th className="border p-2 text-xs">Set Time</th>
                      <th className="border p-2 text-xs">Measured kVp</th>
                      <th className="border p-2 text-xs">Measured Time</th>
                      <th className="border p-2 text-xs">Output (mR)</th>
                      <th className="border p-2 text-xs">P-E-E Avg</th>
                      <th className="border p-2 text-xs">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {watchTechniqueRows?.map((row, index) => (
                      <tr key={row.id}>
                        <td className="border p-1">
                          <Input
                            {...register(`techniqueRows.${index}.sourceToConeDistance`)}
                            className="w-20 text-xs"
                            placeholder="cm"
                          />
                        </td>
                        <td className="border p-1">
                          <Input
                            {...register(`techniqueRows.${index}.setKv`)}
                            className="w-16 text-xs"
                          />
                        </td>
                        <td className="border p-1">
                          <Input
                            {...register(`techniqueRows.${index}.setMa`)}
                            className="w-16 text-xs"
                          />
                        </td>
                        <td className="border p-1">
                          <Input
                            {...register(`techniqueRows.${index}.setTime`)}
                            className="w-20 text-xs"
                            placeholder="ms/P"
                          />
                        </td>
                        <td className="border p-1">
                          <Input
                            {...register(`techniqueRows.${index}.measuredKvp`)}
                            className="w-16 text-xs"
                          />
                        </td>
                        <td className="border p-1">
                          <Input
                            {...register(`techniqueRows.${index}.measuredTime`)}
                            className="w-20 text-xs"
                          />
                        </td>
                        <td className="border p-1">
                          <Input
                            {...register(`techniqueRows.${index}.outputMr`)}
                            className="w-20 text-xs"
                          />
                        </td>
                        <td className="border p-1">
                          <Input
                            {...register(`techniqueRows.${index}.peeAverageMr`)}
                            className="w-20 text-xs"
                          />
                        </td>
                        <td className="border p-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTechniqueRow(index)}
                            disabled={watchTechniqueRows.length === 1}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Button type="button" onClick={addTechniqueRow} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Row
              </Button>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  {...register("notes")}
                  rows={4}
                  placeholder="Enter any additional notes here..."
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Items 13-24 + HVL */}
        {currentStep === 5 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 5: Final Inspection Items & HVL</CardTitle>
              <CardDescription>Complete remaining checks and half-value layer measurements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Items 13-17 */}
              <div>
                <h3 className="font-semibold mb-3">Items 13-17</h3>
                <div className="space-y-3">
                  {watchItems13to17?.map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <span className="text-sm">
                        {item.id}. {item.label}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant={item.result === "MS" ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleMsNi(index, "items13to17")}
                          className={item.result === "MS" ? "bg-green-600 hover:bg-green-700" : ""}
                        >
                          MS
                        </Button>
                        <Button
                          type="button"
                          variant={item.result === "NI" ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleMsNi(index, "items13to17")}
                          className={item.result === "NI" ? "bg-red-600 hover:bg-red-700" : ""}
                        >
                          NI
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Items 18-20 Yes/No */}
              <div>
                <h3 className="font-semibold mb-3">Items 18-20</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm">18. kV +/-8%</span>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={watch("item18KvCheck") === "Yes" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setValue("item18KvCheck", "Yes")}
                        className={watch("item18KvCheck") === "Yes" ? "bg-green-600 hover:bg-green-700" : ""}
                      >
                        Yes
                      </Button>
                      <Button
                        type="button"
                        variant={watch("item18KvCheck") === "No" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setValue("item18KvCheck", "No")}
                        className={watch("item18KvCheck") === "No" ? "bg-red-600 hover:bg-red-700" : ""}
                      >
                        No
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm">19. Time +/-10%</span>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={watch("item19TimeCheck") === "Yes" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setValue("item19TimeCheck", "Yes")}
                        className={watch("item19TimeCheck") === "Yes" ? "bg-green-600 hover:bg-green-700" : ""}
                      >
                        Yes
                      </Button>
                      <Button
                        type="button"
                        variant={watch("item19TimeCheck") === "No" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setValue("item19TimeCheck", "No")}
                        className={watch("item19TimeCheck") === "No" ? "bg-red-600 hover:bg-red-700" : ""}
                      >
                        No
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm">20. Meet H.A.R.P. Specifications</span>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={watch("item20HarpSpec") === "Yes" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setValue("item20HarpSpec", "Yes")}
                        className={watch("item20HarpSpec") === "Yes" ? "bg-green-600 hover:bg-green-700" : ""}
                      >
                        Yes
                      </Button>
                      <Button
                        type="button"
                        variant={watch("item20HarpSpec") === "No" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setValue("item20HarpSpec", "No")}
                        className={watch("item20HarpSpec") === "No" ? "bg-red-600 hover:bg-red-700" : ""}
                      >
                        No
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items 21-23 PEE */}
              <div>
                <h3 className="font-semibold mb-3">Items 21-23: P.E.E. Values</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="peeKv">P.E.E. kV</Label>
                    <Input id="peeKv" {...register("peeKv")} placeholder="kV" />
                  </div>
                  <div>
                    <Label htmlFor="peeMa">P.E.E. mA</Label>
                    <Input id="peeMa" {...register("peeMa")} placeholder="mA" />
                  </div>
                  <div>
                    <Label htmlFor="peeSec">P.E.E. sec</Label>
                    <Input id="peeSec" {...register("peeSec")} placeholder="sec" />
                  </div>
                </div>
              </div>

              {/* Item 24 */}
              <div>
                <Label htmlFor="beamAlignment">24. Beam Alignment</Label>
                <Input id="beamAlignment" {...register("beamAlignment")} />
              </div>

              {/* Half Value Layer */}
              <div>
                <h3 className="font-semibold mb-3">Half Value Layer (HVL)</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="hvl-kV">kV</Label>
                    <Input id="hvl-kV" {...register("halfValueLayer.kV")} />
                  </div>
                  <div>
                    <Label htmlFor="hvl-mA">mA</Label>
                    <Input id="hvl-mA" {...register("halfValueLayer.mA")} />
                  </div>
                  <div>
                    <Label htmlFor="hvl-time">Time</Label>
                    <Input id="hvl-time" {...register("halfValueLayer.time")} />
                  </div>
                  <div>
                    <Label htmlFor="hvl-mR">mR</Label>
                    <Input id="hvl-mR" {...register("halfValueLayer.mR")} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <Label htmlFor="hvl-filtration">Total Filtration (mm Al)</Label>
                    <Input id="hvl-filtration" {...register("halfValueLayer.totalFiltrationMmAl")} />
                  </div>
                  <div>
                    <Label htmlFor="hvl-measured">Measured HVL (mm)</Label>
                    <Input id="hvl-measured" {...register("halfValueLayer.measuredHvlMm")} />
                  </div>
                  <div>
                    <Label htmlFor="hvl-required">Required HVL (mm)</Label>
                    <Input id="hvl-required" {...register("halfValueLayer.requiredHvlMm")} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6 mb-12">
          <Button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            variant="outline"
          >
            Previous
          </Button>

          {currentStep < 5 ? (
            <Button type="button" onClick={nextStep}>
              Next
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                "Generate PDF Report"
              )}
            </Button>
          )}
        </div>
      </form>
    </MainLayout>
  )
}
