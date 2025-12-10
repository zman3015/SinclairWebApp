"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
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
import { Loader2, Plus, Trash2, CheckCircle2 } from "lucide-react"

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
})

type FormData = z.infer<typeof harpFormSchema>

export default function HarpTestPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [testComplete, setTestComplete] = useState(false)

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
    },
  })

  const watchXrayTypes = watch("xrayTypes")

  const toggleXrayType = (type: XrayType) => {
    const current = watchXrayTypes || []
    if (current.includes(type)) {
      setValue("xrayTypes", current.filter((t) => t !== type))
    } else {
      setValue("xrayTypes", [...current, type])
    }
  }

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    // Simulate PDF generation delay
    setTimeout(() => {
      setIsSubmitting(false)
      setTestComplete(true)
      console.log("Form Data:", data)
    }, 2000)
  }

  const fillTestData = () => {
    setValue("testType", "HARP QA")
    setValue("xrayTypes", ["Intra-oral", "Pan"])
    setValue("clinicName", "Bright Smiles Dental Clinic")
    setValue("clinicAddress", "123 Main Street, Toronto, ON M5V 3A8")
    setValue("clinicPhone", "(416) 555-1234")
    setValue("accountNumber", "ACC-12345")
    setValue("roomNumber", "Room 2")
    setValue("inspectionDate", "2025-12-04")
    setValue("technicianName", "John Smith")
    setValue("technicianDate", "2025-12-04")
    setValue("equipmentMake", "Planmeca")
    setValue("equipmentModel", "ProMax 3D")
    setValue("controlSerial", "CTRL-98765")
    setValue("tubeSerial", "TUBE-12345")
    setValue("xrisNumber", "XRIS-2025-001")
    setValue("imageType", "Digital")
  }

  if (testComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Test Complete!</h2>
            <p className="text-gray-600 mb-6">
              The HARP inspection form has been successfully validated.
              In production, this would generate and download a PDF report.
            </p>
            <Button onClick={() => { setTestComplete(false); setCurrentStep(1) }}>
              Test Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2">HARP X-Ray Inspection Form Test</h1>
          <p className="text-gray-600">Testing the multi-step form functionality</p>
          <Button onClick={fillTestData} variant="outline" className="mt-4">
            Fill Test Data
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Step Progress */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                {[1, 2].map((step) => (
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
                    {step < 2 && (
                      <div
                        className={`w-24 h-1 mx-2 ${
                          currentStep > step ? "bg-green-600" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span>Test Setup</span>
                <span>Equipment Info</span>
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

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6 mb-12">
            <Button
              type="button"
              onClick={() => setCurrentStep(1)}
              disabled={currentStep === 1}
              variant="outline"
            >
              Previous
            </Button>

            {currentStep < 2 ? (
              <Button type="button" onClick={() => setCurrentStep(2)}>
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Validating...
                  </>
                ) : (
                  "Complete Test"
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
