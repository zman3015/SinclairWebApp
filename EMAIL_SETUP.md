# Email Setup Guide

This guide explains how to configure email sending for invoices and HARP inspection reports using SendGrid and Netlify Functions.

## Prerequisites

1. **SendGrid Account**: Sign up at [sendgrid.com](https://sendgrid.com)
2. **Verified Sender Email**: Verify your sender email address in SendGrid (e.g., noreply@medline.com)
3. **SendGrid API Key**: Create an API key with "Mail Send" permission

## Environment Variables

Add the following environment variables to your deployment:

### Local Development (.env.local)
```bash
SENDGRID_API_KEY=SG.your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=noreply@medline.com
```

### Netlify Deployment
In your Netlify dashboard:

1. Go to **Site settings** → **Environment variables**
2. Add the following variables:
   - `SENDGRID_API_KEY`: Your SendGrid API key
   - `SENDGRID_FROM_EMAIL`: Your verified sender email

## SendGrid Setup Steps

### 1. Create SendGrid Account
- Visit [sendgrid.com](https://sendgrid.com) and sign up
- Complete email verification

### 2. Verify Sender Email
- Navigate to **Settings** → **Sender Authentication**
- Click **Verify a Single Sender**
- Fill in your details and verify the email address

### 3. Create API Key
- Navigate to **Settings** → **API Keys**
- Click **Create API Key**
- Name: `Dental Tech Portal Email`
- Permission: **Restricted Access** → Enable **Mail Send** only
- Copy the API key (you won't be able to see it again!)

### 4. Add Environment Variables
- Add `SENDGRID_API_KEY` and `SENDGRID_FROM_EMAIL` to:
  - Local `.env.local` file
  - Netlify environment variables

## Testing Email Sending

### Invoice Emails
1. Navigate to **Invoices** page
2. Click **Email** button on any invoice
3. Enter recipient email address
4. Click **Send Email**
5. Check recipient inbox and spam folder

### HARP Inspection Emails
1. Navigate to **HARP Inspections** → **History**
2. Click **View Details** on any inspection
3. Click **Email Report** button
4. Enter recipient email address
5. Click **Send Email**
6. Check recipient inbox and spam folder

## Email Templates

### Invoice Email
- **Subject**: `Invoice {invoice_number} - Medline Sinclair`
- **Attachment**: PDF invoice
- **Content**: Invoice details, payment information, company branding

### HARP Inspection Email
- **Subject**: `HARP X-Ray Inspection Report - {clinic_name}`
- **Attachment**: PDF inspection report
- **Content**: Inspection summary, equipment details, company branding

## Security

### Role-Based Access Control
- Only **Admin** and **Tech** roles can send emails
- **Viewer** role does not have email access
- Authentication is required for all email operations

### Netlify Function Security
- API key is stored securely in environment variables (server-side only)
- Never exposed to client-side code
- RBAC checks enforce role restrictions

## Troubleshooting

### Email Not Sending
1. **Check API Key**: Ensure `SENDGRID_API_KEY` is set correctly
2. **Verify Sender**: Make sure sender email is verified in SendGrid
3. **Check Logs**: View Netlify function logs for detailed error messages
4. **Rate Limits**: Free SendGrid accounts have sending limits

### Email Goes to Spam
1. **Domain Authentication**: Set up domain authentication in SendGrid
2. **SPF/DKIM Records**: Configure DNS records for better deliverability
3. **Warm Up**: Gradually increase sending volume

### Permission Errors
1. **Check User Role**: Ensure user is admin or tech
2. **Re-login**: Sometimes role updates require re-authentication

## SendGrid Pricing

- **Free Tier**: 100 emails/day
- **Essentials**: $19.95/month - 50,000 emails/month
- **Pro**: $89.95/month - 100,000 emails/month

For production use, consider the Essentials plan or higher.

## Support

For SendGrid-specific issues:
- Documentation: [sendgrid.com/docs](https://sendgrid.com/docs)
- Support: [support.sendgrid.com](https://support.sendgrid.com)

For application issues:
- Check Netlify function logs
- Review browser console for errors
- Verify RBAC permissions
