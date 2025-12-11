import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import sgMail from "@sendgrid/mail";

/**
 * Netlify Function: Send Email
 *
 * Sends emails for invoices and HARP inspection reports using SendGrid.
 * Requires authentication and admin/tech role.
 *
 * Environment Variables Required:
 * - SENDGRID_API_KEY: SendGrid API key
 * - SENDGRID_FROM_EMAIL: Verified sender email (e.g., noreply@medline.com)
 */

interface EmailRequest {
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
  // Auth
  userEmail: string;
  userRole: string;
  userId: string;
}

export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  // Handle preflight request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  // Only allow POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    // Parse request body
    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Request body is required" }),
      };
    }

    const body: EmailRequest = JSON.parse(event.body);
    const { to, subject, html, text, attachments, userEmail, userRole, userId } = body;

    // Validate required fields
    if (!to || !subject || !html) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Missing required fields: to, subject, html" }),
      };
    }

    // Authentication check
    if (!userEmail || !userId) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: "Authentication required" }),
      };
    }

    // RBAC check - only admin and tech can send emails
    if (userRole !== "admin" && userRole !== "tech") {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({
          error: "Insufficient permissions. Only admins and technicians can send emails."
        }),
      };
    }

    // Check for SendGrid API key
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      console.error("SENDGRID_API_KEY environment variable is not set");
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: "Email service not configured. Please contact administrator."
        }),
      };
    }

    // Check for from email
    const fromEmail = process.env.SENDGRID_FROM_EMAIL || "noreply@medline.com";

    // Initialize SendGrid
    sgMail.setApiKey(apiKey);

    // Prepare email message
    const msg: sgMail.MailDataRequired = {
      to,
      from: fromEmail,
      subject,
      html,
      text: text || subject,
    };

    // Add attachments if provided
    if (attachments && attachments.length > 0) {
      msg.attachments = attachments;
    }

    // Send email
    await sgMail.send(msg);

    console.log(`Email sent successfully to ${to} by ${userEmail} (${userRole})`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: `Email sent successfully to ${to}`
      }),
    };
  } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    const error = err;
    console.error("Error sending email:", error);

    // SendGrid specific errors
    if (error.response) {
      console.error("SendGrid error response:", error.response.body);
      return {
        statusCode: error.code || 500,
        headers,
        body: JSON.stringify({
          error: "Failed to send email. Please check email configuration.",
          details: error.response.body?.errors?.[0]?.message || error.message
        }),
      };
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Failed to send email",
        details: error.message
      }),
    };
  }
};
