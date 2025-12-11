import { NextRequest, NextResponse } from "next/server"
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"

interface HarpItemCheck {
  id: number
  label: string
  result: string | null
}

interface HarpTechniqueRow {
  id: string
  sourceToConeDistance: string
  setKv: string
  setMa: string
  setTime: string
  measuredKvp: string
  measuredTime: string
  outputMr: string
  peeAverageMr: string
}

interface HarpHalfValueLayer {
  kV: string
  mA: string
  time: string
  totalFiltrationMmAl: string
  measuredHvlMm: string
  requiredHvlMm: string
  mR: string
}

interface HarpInspectionFormData {
  testType: string
  xrayTypes: string[]
  clinicName: string
  clinicAddress: string
  clinicPhone: string
  accountNumber: string
  roomNumber: string
  inspectionDate: string
  technicianName: string
  technicianDate: string

  equipmentMake: string
  equipmentModel: string
  controlSerial: string
  tubeSerial: string
  xrisNumber: string
  imageType: string

  items1to12: HarpItemCheck[]
  techniqueRows: HarpTechniqueRow[]
  notes: string

  items13to17: HarpItemCheck[]
  item18KvCheck: string | null
  item19TimeCheck: string | null
  item20HarpSpec: string | null
  peeKv: string
  peeMa: string
  peeSec: string
  beamAlignment: string

  halfValueLayer: HarpHalfValueLayer
}

export async function POST(request: NextRequest) {
  try {
    const data: HarpInspectionFormData = await request.json()

    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([612, 792]) // Letter size
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    const { width, height } = page.getSize()
    let yPosition = height - 40

    // Helper function to add text
    const addText = (text: string, x: number, size = 10, isBold = false) => {
      page.drawText(text, {
        x,
        y: yPosition,
        size,
        font: isBold ? fontBold : font,
        color: rgb(0, 0, 0),
      })
    }

    // Helper to move to next line
    const nextLine = (spacing = 15) => {
      yPosition -= spacing
    }

    // Title
    addText("HARP X-RAY INSPECTION REPORT", 40, 18, true)
    nextLine(30)

    // Test Type
    addText(`Test Type: ${data.testType}`, 40, 12, true)
    nextLine(20)

    // Clinic Information
    addText("CLINIC INFORMATION", 40, 14, true)
    nextLine(20)
    addText(`Name: ${data.clinicName}`, 40)
    nextLine()
    addText(`Address: ${data.clinicAddress}`, 40)
    nextLine()
    addText(`Phone: ${data.clinicPhone}`, 40)
    addText(`Account #: ${data.accountNumber}`, 320)
    nextLine()
    addText(`Room #: ${data.roomNumber}`, 40)
    addText(`Inspection Date: ${data.inspectionDate}`, 320)
    nextLine()
    addText(`X-ray Types: ${data.xrayTypes.join(", ")}`, 40)
    nextLine(25)

    // Equipment Information
    addText("EQUIPMENT INFORMATION", 40, 14, true)
    nextLine(20)
    addText(`Make/Model: ${data.equipmentMake} ${data.equipmentModel}`, 40)
    nextLine()
    addText(`Control Serial #: ${data.controlSerial}`, 40)
    addText(`Tube Serial #: ${data.tubeSerial}`, 320)
    nextLine()
    addText(`XRIS #: ${data.xrisNumber}`, 40)
    addText(`Image Type: ${data.imageType}`, 320)
    nextLine(25)

    // Items 1-12
    addText("INSPECTION ITEMS 1-12", 40, 14, true)
    nextLine(20)
    for (const item of data.items1to12) {
      if (yPosition < 60) {
        // Add new page if running out of space
        const newPage = pdfDoc.addPage([612, 792])
        yPosition = height - 40
        page.moveTo(0, 0)
      }
      const result = item.result || "N/A"
      addText(`${item.id}. ${item.label}`, 40, 9)
      addText(result, 500, 9, true)
      nextLine(12)
    }
    nextLine(10)

    // Check if we need a new page
    if (yPosition < 200) {
      const newPage = pdfDoc.addPage([612, 792])
      yPosition = height - 40
    }

    // Test Parameters
    addText("TEST PARAMETERS AND RESULTS", 40, 14, true)
    nextLine(20)

    if (data.techniqueRows.length > 0) {
      addText("Distance | Set kV | Set mA | Set Time | Meas kVp | Meas Time | Output | P-E-E", 40, 8, true)
      nextLine(15)

      for (const row of data.techniqueRows) {
        if (yPosition < 60) {
          const newPage = pdfDoc.addPage([612, 792])
          yPosition = height - 40
        }
        const rowText = `${row.sourceToConeDistance} | ${row.setKv} | ${row.setMa} | ${row.setTime} | ${row.measuredKvp} | ${row.measuredTime} | ${row.outputMr} | ${row.peeAverageMr}`
        addText(rowText, 40, 8)
        nextLine(12)
      }
    }

    if (data.notes) {
      nextLine(5)
      addText(`Notes: ${data.notes}`, 40, 9)
      nextLine(15)
    }
    nextLine(10)

    // Check if we need a new page
    if (yPosition < 250) {
      const newPage = pdfDoc.addPage([612, 792])
      yPosition = height - 40
    }

    // Items 13-17
    addText("INSPECTION ITEMS 13-17", 40, 14, true)
    nextLine(20)
    for (const item of data.items13to17) {
      const result = item.result || "N/A"
      addText(`${item.id}. ${item.label}`, 40, 9)
      addText(result, 500, 9, true)
      nextLine(12)
    }
    nextLine(10)

    // Items 18-20
    addText("VERIFICATION CHECKS", 40, 14, true)
    nextLine(20)
    addText(`18. kV +/-8%: ${data.item18KvCheck || "N/A"}`, 40, 9)
    nextLine(12)
    addText(`19. Time +/-10%: ${data.item19TimeCheck || "N/A"}`, 40, 9)
    nextLine(12)
    addText(`20. Meet H.A.R.P. Specifications: ${data.item20HarpSpec || "N/A"}`, 40, 9)
    nextLine(20)

    // P.E.E. Values
    addText("P.E.E. VALUES", 40, 14, true)
    nextLine(20)
    addText(`kV: ${data.peeKv || "N/A"}`, 40, 9)
    addText(`mA: ${data.peeMa || "N/A"}`, 200, 9)
    addText(`sec: ${data.peeSec || "N/A"}`, 360, 9)
    nextLine(20)

    // Beam Alignment
    addText(`Beam Alignment: ${data.beamAlignment || "N/A"}`, 40, 9)
    nextLine(25)

    // Half Value Layer
    addText("HALF VALUE LAYER (HVL)", 40, 14, true)
    nextLine(20)
    addText(`kV: ${data.halfValueLayer.kV || "N/A"}`, 40, 9)
    addText(`mA: ${data.halfValueLayer.mA || "N/A"}`, 150, 9)
    addText(`Time: ${data.halfValueLayer.time || "N/A"}`, 260, 9)
    addText(`mR: ${data.halfValueLayer.mR || "N/A"}`, 370, 9)
    nextLine(15)
    addText(`Total Filtration: ${data.halfValueLayer.totalFiltrationMmAl || "N/A"} mm Al`, 40, 9)
    nextLine(15)
    addText(`Measured HVL: ${data.halfValueLayer.measuredHvlMm || "N/A"} mm`, 40, 9)
    nextLine(15)
    addText(`Required HVL: ${data.halfValueLayer.requiredHvlMm || "N/A"} mm`, 40, 9)
    nextLine(30)

    // Technician Information
    addText("TECHNICIAN INFORMATION", 40, 14, true)
    nextLine(20)
    addText(`Technician: ${data.technicianName}`, 40, 10)
    addText(`Date: ${data.technicianDate}`, 320, 10)
    nextLine(25)

    // Footer
    addText("NOTE: MINISTRY REGULATIONS REQUIRE Q.A. / Q.C. RECORDS TO BE KEPT FOR SIX YEARS", 40, 8)

    const pdfBytes = await pdfDoc.save()

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="HARP-Inspection-${data.accountNumber}.pdf"`,
      },
    })
  } catch (error) {
    console.error("Error generating PDF:", error)
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    )
  }
}
