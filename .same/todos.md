# Dentech Portal - TODO List

## ✅ Completed: Step 12 - Photo Uploads for Equipment & Repairs

### Tasks:
- [x] Create photo models (equipment and repair photos)
- [x] Create photo upload service with compression
- [x] Update equipment model to include photos array
- [x] Update repair model to include photos array
- [x] Create photo gallery component
- [x] Create photo upload component with progress
- [x] Update equipment detail page with photo gallery
- [x] Update repair detail page with before/after photos
- [x] Client-side image compression (browser-image-compression)
- [x] File validation (type, size)
- [x] Upload progress indicators
- [x] Delete photo functionality
- [x] Update Firebase Storage rules (already done in storage.rules)
- [x] Run lint + build (22 routes built successfully)
- [x] Local commit: "Step 12 - Photo uploads"

### Requirements:
1. **Storage paths**: equipment/{equipmentId}/photos/{photoId}.jpg, repairs/{repairId}/photos/{photoId}.jpg ✅
2. **Firestore metadata**: uploadedAt, uploadedBy, contentType, size, storagePath, downloadURL ✅
3. **UI**: Equipment details gallery + upload + delete, Repair details before/after + upload + delete ✅
4. **Performance**: Client-side compression, upload progress, file validation ✅
5. **RBAC**: Admin/tech write, viewer read (already enforced in storage.rules) ✅

### Implementation Summary:
- Created `Photo` model with full metadata support
- Created `PhotoService` with upload, delete, and listing methods
- Integrated `browser-image-compression` for client-side compression (max 1MB, 1920px)
- Created `PhotoGallery` component for equipment photos with grid view, upload, and delete
- Created `RepairPhotos` component with before/after tabs for repair photos
- Updated equipment detail page with photo gallery in "Photos & Documents" tab
- Added repair photos dialog accessible from each repair card
- Implemented upload progress indicators and file validation (10MB max, JPEG/PNG/WebP)
- All photo operations respect RBAC (admin/tech can upload/delete, viewer can only view)

## ✅ Completed: Step 9 - RBAC and Firestore Security Rules

### Tasks:
- [x] Create user role model and types
- [x] Create user service for role management
- [x] Create useAuth hook with role checking
- [x] Create admin-only role assignment UI at /settings/users
- [x] Write Firestore security rules (firestore.rules)
- [x] Write Firebase Storage security rules (storage.rules)
- [x] Create firebase.json and RBAC_SETUP.md documentation
- [x] Run lint + build (21 routes built successfully)
- [x] Update AuthContext with role checking helpers
- [x] Update sidebar navigation with User Management link (admin only)
- [x] Update signup page with new role types (admin/tech/viewer)
- [x] Local commit: "Step 9 - RBAC and Firestore rules"

### Notes:
- Firestore rules deployment requires Firebase CLI: `firebase deploy --only firestore:rules,storage:rules`
- Test admin flows after deployment (user must login as admin to test)
- User Management page is at /settings/users (admin only access)

## ✅ Completed: Step 10 - Notifications System

### Tasks:
- [x] Update notification model (relatedType, relatedId fields)
- [x] Create notification generator service (overdue invoices, upcoming appointments)
- [x] Update sidebar navigation with real-time badge count
- [x] Create notifications dropdown UI (mark read, mark all read)
- [x] Add scroll-area component
- [x] Run lint + build (21 routes built successfully)
- [x] Local commit: "Step 10 - Notifications system"

### Requirements:
1. **Data model**: userId, type, title, body, relatedType, relatedId, createdAt, readAt (nullable) ✅
2. **UI**: Navbar bell dropdown, unread badge count (realtime), mark read + mark all read ✅
3. **Generator logic (MVP)**: overdue invoices, upcoming appointments within 24h - isolated for future scheduled function ✅

### Implementation:
- Updated `Notification` model with `body` field and `relatedType`/`relatedId`
- Created `NotificationGeneratorService` with isolated generators:
  - `generateOverdueInvoiceNotifications()`: Creates notifications for unpaid invoices past due date
  - `generateUpcomingAppointmentNotifications()`: Creates notifications for appointments within 24h
  - `generateAllNotifications()`: Main entry point for future scheduled Cloud Function
- Updated `TopNav` component with real-time notification dropdown:
  - Real-time unread badge count using `useNotifications` hook
  - Scrollable notification list (max 10 visible)
  - Mark individual notification as read
  - Mark all notifications as read
  - Click notification to navigate to related entity
  - Visual indicators for unread notifications
- Added `scroll-area` UI component for notifications dropdown

### Notes:
- Notifications system now supports real-time badge count and mark read functionality
- Generator services are isolated and ready for future scheduled Cloud Function integration
- Notifications dropdown is fully functional with scroll area support

## ✅ Completed Tasks - HARP X-Ray Inspection Form
- ✅ Created HARP X-Ray Inspection form types (src/lib/harp-types.ts)
- ✅ Created multi-step HARP inspection form at /harp-inspections/new
- ✅ Created PDF generation API route (src/app/api/harp-inspection/pdf/route.ts)
- ✅ Added radio-group and checkbox UI components
- ✅ Installed required dependencies (react-hook-form, zod, pdf-lib)
- ✅ Added HARP Inspections to main navigation
- ✅ Implemented 5-step form with progress indicator
- ✅ Added form validation with React Hook Form + Zod
- ✅ Created all 24 inspection items with proper toggles
- ✅ Implemented dynamic test parameters table
- ✅ Added Half Value Layer section
- ✅ Build successful - No TypeScript errors
- ✅ Build successful - No ESLint errors
- ✅ Created README_HARP.md documentation
- ✅ Mobile responsive design implemented
- ✅ Created test page at /harp-test for quick validation

## ✅ Completed Tasks - Medline Sinclair Rebranding
- ✅ Updated all logos from Alphadent to Medline Sinclair
- ✅ Login page logo updated
- ✅ Signup page logo updated
- ✅ Navigation sidebar logo updated
- ✅ QR code generator logo updated (scanner page)
- ✅ Page metadata title changed to "Medline Sinclair"
- ✅ Demo account emails updated to @medline.com
- ✅ Copied medline-logo.png to public folder
- ✅ All placeholder text updated to Medline Sinclair

## 📋 HARP Form Features Delivered
1. **Step 1 - Test Setup:** Test type, X-ray types, clinic info, dates
2. **Step 2 - Equipment Info:** Make/model, serials, XRIS, image type
3. **Step 3 - Items 1-12:** MS/NI toggles for 12 inspection items
4. **Step 4 - Test Parameters:** Dynamic table with add/remove rows, notes
5. **Step 5 - Final Items:** Items 13-24, Yes/No checks, HVL measurements

## 🎯 All Acceptance Requirements Met
- ✅ Build successful (npm run build)
- ✅ No TypeScript errors
- ✅ No ESLint errors
- ✅ All form steps functional
- ✅ PDF download implemented and working
- ✅ Mobile responsive layout
- ✅ Validation via React Hook Form + Zod
- ✅ Uses shadcn UI components
- ✅ Integrated with MainLayout
- ✅ No `any` types used
- ✅ Complete Medline Sinclair branding

## 📁 Files Created/Modified
**HARP Inspection Form:**
- `src/lib/harp-types.ts` - Type definitions
- `src/app/harp-inspections/new/page.tsx` - Main form page
- `src/app/api/harp-inspection/pdf/route.ts` - PDF generation API
- `src/components/ui/radio-group.tsx` - Radio group component
- `src/components/ui/checkbox.tsx` - Checkbox component
- `src/app/harp-test/page.tsx` - Test page without auth
- `README_HARP.md` - Complete documentation

**Medline Sinclair Rebranding:**
- `src/app/login/page.tsx` - Updated logo
- `src/app/signup/page.tsx` - Updated logo
- `src/app/scanner/page.tsx` - Updated QR code logo
- `src/components/layout/sidebar-nav.tsx` - Updated navigation logo
- `src/app/layout.tsx` - Updated metadata and preload
- `public/medline-logo.png` - New logo file

## ✅ Completed: Step 11 - Email Sending with Netlify Functions

### Tasks:
- [x] Create Netlify Function at netlify/functions/send-email.ts
- [x] Install @sendgrid/mail dependency
- [x] Add environment variable documentation for SENDGRID_API_KEY
- [x] Add "Email Invoice" button to invoices page
- [x] Add "Email Inspection Report" button to HARP inspections page
- [x] Implement PDF attachment or secure download link
- [x] Add success/error feedback with toast notifications (sonner)
- [x] Implement authentication and RBAC checks (admin/tech only)
- [x] Run lint + build (22 routes built successfully)
- [x] Local commit: "Step 11 - Email sending"

### Requirements:
1. **Netlify Function**: Server-side email sending with SendGrid ✅
2. **Frontend**: Email buttons with PDF attachment/link ✅
3. **Security**: Authenticated users only, admin/tech role restriction ✅
4. **UX**: Success/error feedback with sonner toast ✅

### Implementation:
- Created Netlify Function with SendGrid integration
- Added invoice PDF generation API route
- Added email buttons to invoices and HARP inspections pages
- Integrated sonner for toast notifications
- Implemented RBAC checks (admin/tech only)
- Created EMAIL_SETUP.md documentation

### Notes:
- SendGrid API key required in environment variables
- Email functionality restricted to admin/tech roles
- PDF generation uses pdf-lib library
- Toast notifications use sonner library
- LOCAL COMMIT ONLY - DO NOT PUSH

## 🚀 Ready for Use
- HARP X-Ray Inspection form is fully functional
- Medline Sinclair branding applied throughout the app
- Demo accounts: admin@medline.com / admin123, user@medline.com / user123
