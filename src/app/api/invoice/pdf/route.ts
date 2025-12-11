import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function POST(request: NextRequest) {
  try {
    const invoice = await request.json();

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]); // Letter size

    // Load fonts
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const { width, height } = page.getSize();
    let yPosition = height - 50;

    // Header
    page.drawText("INVOICE", {
      x: 50,
      y: yPosition,
      size: 24,
      font: fontBold,
      color: rgb(0, 0.24, 0.48), // Dental blue
    });

    yPosition -= 40;

    // Invoice Number
    page.drawText(`Invoice Number: ${invoice.invoiceNumber}`, {
      x: 50,
      y: yPosition,
      size: 14,
      font: fontBold,
    });

    yPosition -= 30;

    // Company Info (Left side)
    page.drawText("Medline Sinclair", {
      x: 50,
      y: yPosition,
      size: 12,
      font: fontBold,
    });

    yPosition -= 18;

    page.drawText("Professional Dental Equipment Service", {
      x: 50,
      y: yPosition,
      size: 10,
      font,
    });

    // Client Info (Right side)
    const rightX = width - 250;
    let rightY = height - 90;

    page.drawText("Bill To:", {
      x: rightX,
      y: rightY,
      size: 10,
      font: fontBold,
    });

    rightY -= 18;

    page.drawText(invoice.clientName, {
      x: rightX,
      y: rightY,
      size: 12,
      font: fontBold,
    });

    yPosition -= 40;

    // Invoice Details
    page.drawText(`Invoice Date: ${new Date(invoice.date || invoice.invoiceDate).toLocaleDateString()}`, {
      x: 50,
      y: yPosition,
      size: 10,
      font,
    });

    yPosition -= 18;

    page.drawText(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, {
      x: 50,
      y: yPosition,
      size: 10,
      font,
    });

    yPosition -= 18;

    page.drawText(`Status: ${invoice.status}`, {
      x: 50,
      y: yPosition,
      size: 10,
      font,
    });

    yPosition -= 40;

    // Line Items Table Header
    const tableTop = yPosition;
    const tableLeft = 50;
    const col1 = tableLeft;
    const col2 = tableLeft + 300;
    const col3 = tableLeft + 380;
    const col4 = tableLeft + 450;

    // Draw table header background
    page.drawRectangle({
      x: tableLeft,
      y: yPosition - 5,
      width: width - 100,
      height: 25,
      color: rgb(0.95, 0.95, 0.95),
    });

    page.drawText("Description", {
      x: col1 + 5,
      y: yPosition,
      size: 10,
      font: fontBold,
    });

    page.drawText("Qty", {
      x: col2,
      y: yPosition,
      size: 10,
      font: fontBold,
    });

    page.drawText("Price", {
      x: col3,
      y: yPosition,
      size: 10,
      font: fontBold,
    });

    page.drawText("Total", {
      x: col4,
      y: yPosition,
      size: 10,
      font: fontBold,
    });

    yPosition -= 25;

    // Line Items
    const lineItems = invoice.lineItems || [];
    for (const item of lineItems) {
      if (yPosition < 100) {
        // Add new page if needed
        const newPage = pdfDoc.addPage([612, 792]);
        yPosition = height - 50;
      }

      // Truncate description if too long
      const description = item.description.length > 50
        ? item.description.substring(0, 47) + "..."
        : item.description;

      page.drawText(description, {
        x: col1 + 5,
        y: yPosition,
        size: 9,
        font,
      });

      page.drawText(`${item.quantity || 1}`, {
        x: col2,
        y: yPosition,
        size: 9,
        font,
      });

      page.drawText(`$${(item.unitPrice || 0).toFixed(2)}`, {
        x: col3,
        y: yPosition,
        size: 9,
        font,
      });

      page.drawText(`$${(item.total || 0).toFixed(2)}`, {
        x: col4,
        y: yPosition,
        size: 9,
        font,
      });

      yPosition -= 20;
    }

    yPosition -= 10;

    // Draw line separator
    page.drawLine({
      start: { x: tableLeft, y: yPosition },
      end: { x: width - 50, y: yPosition },
      thickness: 1,
      color: rgb(0.7, 0.7, 0.7),
    });

    yPosition -= 20;

    // Subtotal
    page.drawText("Subtotal:", {
      x: col3 - 20,
      y: yPosition,
      size: 10,
      font,
    });

    page.drawText(`$${(invoice.subtotal || 0).toFixed(2)}`, {
      x: col4,
      y: yPosition,
      size: 10,
      font,
    });

    yPosition -= 18;

    // Tax
    page.drawText(`Tax (${invoice.taxRate || 0}%):`, {
      x: col3 - 20,
      y: yPosition,
      size: 10,
      font,
    });

    page.drawText(`$${(invoice.tax || 0).toFixed(2)}`, {
      x: col4,
      y: yPosition,
      size: 10,
      font,
    });

    yPosition -= 25;

    // Total
    page.drawRectangle({
      x: col3 - 30,
      y: yPosition - 5,
      width: width - col3 - 20,
      height: 25,
      color: rgb(0, 0.24, 0.48),
    });

    page.drawText("Total:", {
      x: col3 - 20,
      y: yPosition,
      size: 12,
      font: fontBold,
      color: rgb(1, 1, 1),
    });

    page.drawText(`$${(invoice.total || 0).toFixed(2)}`, {
      x: col4,
      y: yPosition,
      size: 12,
      font: fontBold,
      color: rgb(1, 1, 1),
    });

    yPosition -= 40;

    // Notes
    if (invoice.notes) {
      page.drawText("Notes:", {
        x: 50,
        y: yPosition,
        size: 10,
        font: fontBold,
      });

      yPosition -= 18;

      // Split notes into multiple lines if needed
      const maxWidth = 500;
      const words = invoice.notes.split(' ');
      let line = '';

      for (const word of words) {
        const testLine = line + word + ' ';
        const textWidth = font.widthOfTextAtSize(testLine, 9);

        if (textWidth > maxWidth && line.length > 0) {
          page.drawText(line, {
            x: 50,
            y: yPosition,
            size: 9,
            font,
          });
          line = word + ' ';
          yPosition -= 14;

          if (yPosition < 80) break;
        } else {
          line = testLine;
        }
      }

      if (line.length > 0 && yPosition >= 80) {
        page.drawText(line, {
          x: 50,
          y: yPosition,
          size: 9,
          font,
        });
      }
    }

    // Footer
    page.drawText("Thank you for your business!", {
      x: 50,
      y: 50,
      size: 10,
      font,
      color: rgb(0.5, 0.5, 0.5),
    });

    // Serialize the PDF
    const pdfBytes = await pdfDoc.save();

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`,
      },
    });
  } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    const error = err;
    console.error("Error generating invoice PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate invoice PDF", details: error.message },
      { status: 500 }
    );
  }
}
