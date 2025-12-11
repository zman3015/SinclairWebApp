import type { Invoice } from "./models/invoice";
import type { HarpInspection } from "./models/harp-inspection";

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: Array<{
    content: string; // base64 encoded
    filename: string;
    type: string;
    disposition: string;
  }>;
  userEmail: string;
  userRole: string;
  userId: string;
}

interface SendEmailResponse {
  success: boolean;
  message?: string;
  error?: string;
  details?: string;
}

/**
 * Send email via Netlify Function
 */
export async function sendEmail(params: SendEmailParams): Promise<SendEmailResponse> {
  try {
    const response = await fetch("/.netlify/functions/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Failed to send email",
        details: data.details,
      };
    }

    return {
      success: true,
      message: data.message,
    };
  } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    const error = err;
    return {
      success: false,
      error: "Network error. Please try again.",
      details: error.message,
    };
  }
}

/**
 * Send invoice email with PDF attachment
 */
export async function sendInvoiceEmail(
  invoice: Invoice,
  recipientEmail: string,
  pdfBase64: string,
  user: { email: string; role: string; uid: string }
): Promise<SendEmailResponse> {
  const subject = `Invoice ${invoice.invoiceNumber} - Medline Sinclair`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #003d7a; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        .button { background-color: #ffc72c; color: #003d7a; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #003d7a; color: white; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Medline Sinclair</h1>
          <p>Professional Dental Equipment Service</p>
        </div>
        <div class="content">
          <h2>Invoice ${invoice.invoiceNumber}</h2>
          <p>Dear ${invoice.clientName},</p>
          <p>Please find attached your invoice from Medline Sinclair.</p>

          <table>
            <tr>
              <th>Invoice Number</th>
              <td>${invoice.invoiceNumber}</td>
            </tr>
            <tr>
              <th>Date</th>
              <td>${new Date(invoice.invoiceDate).toLocaleDateString()}</td>
            </tr>
            <tr>
              <th>Due Date</th>
              <td>${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}</td>
            </tr>
            <tr>
              <th>Status</th>
              <td>${invoice.status}</td>
            </tr>
            <tr>
              <th>Total Amount</th>
              <td><strong>$${invoice.total.toFixed(2)}</strong></td>
            </tr>
          </table>

          <p>The invoice is attached as a PDF document. Please review and process payment by the due date.</p>

          ${invoice.notes ? `<p><strong>Notes:</strong><br>${invoice.notes}</p>` : ''}

          <p>If you have any questions, please don't hesitate to contact us.</p>
        </div>
        <div class="footer">
          <p>Thank you for your business!</p>
          <p>Medline Sinclair - Professional Dental Equipment Service</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Invoice ${invoice.invoiceNumber} - Medline Sinclair

Dear ${invoice.clientName},

Please find attached your invoice from Medline Sinclair.

Invoice Number: ${invoice.invoiceNumber}
Date: ${new Date(invoice.invoiceDate).toLocaleDateString()}
Due Date: ${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}
Status: ${invoice.status}
Total Amount: $${invoice.total.toFixed(2)}

${invoice.notes ? `Notes: ${invoice.notes}` : ''}

Thank you for your business!
Medline Sinclair
  `;

  return sendEmail({
    to: recipientEmail,
    subject,
    html,
    text,
    attachments: [
      {
        content: pdfBase64,
        filename: `invoice-${invoice.invoiceNumber}.pdf`,
        type: "application/pdf",
        disposition: "attachment",
      },
    ],
    userEmail: user.email,
    userRole: user.role,
    userId: user.uid,
  });
}

/**
 * Send HARP inspection report email with PDF attachment
 */
export async function sendHarpReportEmail(
  inspection: HarpInspection,
  recipientEmail: string,
  pdfBase64: string,
  user: { email: string; role: string; uid: string }
): Promise<SendEmailResponse> {
  const subject = `HARP X-Ray Inspection Report - ${inspection.clinicName}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #003d7a; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        .status { display: inline-block; padding: 6px 12px; border-radius: 4px; font-weight: bold; }
        .status-completed { background-color: #d4edda; color: #155724; }
        .status-draft { background-color: #fff3cd; color: #856404; }
        .status-failed { background-color: #f8d7da; color: #721c24; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #003d7a; color: white; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Medline Sinclair</h1>
          <p>HARP X-Ray Inspection Report</p>
        </div>
        <div class="content">
          <h2>Inspection Report</h2>
          <p>Please find attached the HARP X-Ray Inspection Report for your facility.</p>

          <table>
            <tr>
              <th>Clinic</th>
              <td>${inspection.clinicName}</td>
            </tr>
            <tr>
              <th>Test Date</th>
              <td>${new Date(inspection.inspectionDate).toLocaleDateString()}</td>
            </tr>
            <tr>
              <th>Test Type</th>
              <td>${inspection.testType}</td>
            </tr>
            <tr>
              <th>X-Ray Type</th>
              <td>${inspection.xrayTypes.join(", ")}</td>
            </tr>
            <tr>
              <th>Status</th>
              <td><span class="status status-${inspection.status.toLowerCase()}">${inspection.status}</span></td>
            </tr>
            <tr>
              <th>Technician</th>
              <td>${inspection.technicianName || 'N/A'}</td>
            </tr>
          </table>

          ${inspection.equipmentMake && inspection.equipmentModel ? `
          <h3>Equipment Information</h3>
          <table>
            <tr>
              <th>Make/Model</th>
              <td>${inspection.equipmentMake} ${inspection.equipmentModel}</td>
            </tr>
            ${inspection.tubeSerial ? `<tr><th>Tube Serial</th><td>${inspection.tubeSerial}</td></tr>` : ''}
            ${inspection.controlSerial ? `<tr><th>Control Serial</th><td>${inspection.controlSerial}</td></tr>` : ''}
          </table>
          ` : ''}

          <p>The complete inspection report is attached as a PDF document.</p>

          <p>If you have any questions about this inspection, please contact us.</p>
        </div>
        <div class="footer">
          <p>Medline Sinclair - Professional Dental Equipment Service</p>
          <p>HARP Certified Inspections</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
HARP X-Ray Inspection Report - Medline Sinclair

Clinic: ${inspection.clinicName}
Test Date: ${new Date(inspection.inspectionDate).toLocaleDateString()}
Test Type: ${inspection.testType}
X-Ray Type: ${inspection.xrayTypes.join(", ")}
Status: ${inspection.status}
Technician: ${inspection.technicianName || 'N/A'}

${inspection.equipmentMake && inspection.equipmentModel ? `
Equipment: ${inspection.equipmentMake} ${inspection.equipmentModel}
${inspection.tubeSerial ? `Tube Serial: ${inspection.tubeSerial}` : ''}
${inspection.controlSerial ? `Control Serial: ${inspection.controlSerial}` : ''}
` : ''}

The complete inspection report is attached as a PDF document.

Medline Sinclair - Professional Dental Equipment Service
  `;

  return sendEmail({
    to: recipientEmail,
    subject,
    html,
    text,
    attachments: [
      {
        content: pdfBase64,
        filename: `harp-inspection-${inspection.clinicName}-${new Date(inspection.inspectionDate).toISOString().split('T')[0]}.pdf`,
        type: "application/pdf",
        disposition: "attachment",
      },
    ],
    userEmail: user.email,
    userRole: user.role,
    userId: user.uid,
  });
}
