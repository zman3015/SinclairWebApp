# Dental Equipment Technician Portal

A comprehensive web application for dental equipment service technicians to manage equipment, service tickets, parts inventory, client accounts, and schedules.

## 🌟 Features

### Equipment Management
- QR code-based equipment tracking and identification
- Complete equipment profiles with service history
- Equipment registration and detailed specifications
- Photo documentation for damages and repairs

### Client & Account Management
- Multi-clinic account management
- Territory-based filtering and organization
- Interactive map view of clinic locations
- Route optimization for efficient visit scheduling
- Detailed client profiles with service history

### Service & Repair Tracking
- Service ticket creation and management
- Complete repair history with parts used
- Photo documentation and notes
- Service type tracking (Routine, Emergency, Installation, Warranty)

### Inventory & Parts
- Parts catalog with search and filtering
- Personal inventory tracking
- Reorder suggestions and supplier integration
- Parts ordering and transfer between locations

### Schedule & Appointments
- Calendar view of appointments and service calls
- Route planning with Google Maps integration
- Real-time driving directions
- Multi-select visit planning

### Documentation
- Service manual upload and management
- Equipment-specific manual access
- Searchable documentation library

### Invoicing
- Invoice creation and tracking
- Labor and parts cost calculation
- Billing history per client

## 🛠️ Tech Stack

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Authentication:** Firebase Auth
- **Database:** Cloud Firestore
- **Maps:** Google Maps API
- **Package Manager:** Bun
- **Deployment:** Netlify

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Firebase account
- Google Maps API key (optional, for map features)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd dental-tech-portal
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Edit `.env.local` with your Firebase configuration:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

5. Run the development server:
```bash
bun dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔐 Firebase Setup

See `FIREBASE_SETUP.md` for detailed Firebase configuration instructions.

### Quick Setup Steps:

1. Create a Firebase project
2. Enable Email/Password authentication
3. Create a Firestore database
4. Publish the security rules from `firestore.rules`
5. Add your Firebase config to `.env.local`

See `FIRESTORE_RULES_SETUP.md` for security rules setup.

## 👥 User Roles

### Admin
- Full access to all features
- Can manage all clients and equipment
- Access to reports and settings
- Can delete and modify all data

### User (Technician)
- Access to assigned service tickets
- Can view and update equipment
- Can create service records and invoices
- Limited client management access

## 📝 Creating Demo Accounts

Use the signup page to create accounts:

**Admin Account:**
- Email: admin@alphadent.com
- Password: admin123
- Role: Admin

**User Account:**
- Email: user@alphadent.com
- Password: user123
- Role: User

## 🌐 Deployment

The application is deployed on Netlify: https://dentechportal.netlify.app/

See `DEPLOYMENT.md` for deployment configuration details.

### Deploy Your Own

1. Connect your GitHub repository to Netlify
2. Configure build settings:
   - Build command: `bun run build`
   - Publish directory: `.next`
3. Add environment variables in Netlify dashboard
4. Deploy!

## 📚 Documentation

- `FIREBASE_SETUP.md` - Complete Firebase setup guide
- `FIRESTORE_RULES_SETUP.md` - Security rules setup instructions
- `DEPLOYMENT.md` - Netlify deployment information
- `firestore.rules` - Firestore security rules

## 🐛 Troubleshooting

### Infinite Loading on Login
- Ensure Firestore security rules are published
- Check browser console for Firebase errors
- Wait 30 seconds after publishing rules
- Create an account via signup page first

### Firebase Errors
- Verify `.env.local` has correct credentials
- Ensure Email/Password auth is enabled in Firebase Console
- Check that Firestore database is created

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Delete node_modules: `rm -rf node_modules`
- Reinstall: `bun install`
- Rebuild: `bun run build`

## 📄 License

This project is proprietary software for Alphadent dental equipment services.

## 🤝 Support

For issues or questions, contact the development team or refer to the documentation files included in the project.
