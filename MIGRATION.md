# Data Layer Migration Tracker

This document tracks the migration of all modules from hardcoded sample data to the new Firestore-backed data layer created in the architectural refactor.

## Migration Status

### ✅ Completed

| Module | File(s) | Status | Notes |
|--------|---------|--------|-------|
| Dashboard | `src/app/page.tsx` | ✅ Migrated | Using `useDashboard` hook with real-time unread notifications |
| Invoices | `src/app/invoices/page.tsx` | ✅ Migrated | Full CRUD with `useInvoices`, auto-generated invoice numbers, mark as paid |
| Accounts (Clients) | `src/app/accounts/page.tsx` | ✅ Migrated | Using `useClientsPaginated` hook with filtering, pagination, and loading states |
| Account Detail | `src/app/accounts/[id]/page.tsx` | ✅ Migrated | Using `useClient`, `useEquipment`, `ServiceHistoryService`, and `InvoiceService` with loading/error states |
| Equipment List | `src/app/equipment/page.tsx` | ✅ Migrated | Using `useEquipment` hook with filtering, stats, and loading states |
| Equipment Detail | `src/app/equipment/[id]/page.tsx` | ✅ Migrated | Using `useEquipment`, `useRepair` hooks with repair CRUD, loading/error states, and repair history tracking |
| Manuals | `src/app/manuals/page.tsx` | ✅ Migrated | Full Firebase Storage integration with upload/delete, using `useManuals` hook with real-time data, filtering, and download tracking |
| HARP Inspections | `src/app/harp-inspections/new/page.tsx`, `src/app/harp-inspections/page.tsx` | ✅ Migrated | Full CRUD with `useHarpInspections`, save to Firestore, history with filtering, PDF generation |
| Notifications | `src/components/layout/sidebar-nav.tsx` | ✅ Migrated | Real-time notifications with dropdown, mark read/all read, automated generators for overdue invoices and upcoming appointments |
| Email Sending | `netlify/functions/send-email.ts`, `src/app/invoices/page.tsx`, `src/app/harp-inspections/page.tsx` | ✅ Implemented | Secure email sending for invoices and HARP reports via Netlify Functions + SendGrid, RBAC-protected (admin/tech only) |
| Photo Uploads | `src/lib/services/photo.service.ts`, `src/components/photos/photo-gallery.tsx`, `src/components/photos/repair-photos.tsx`, `src/app/equipment/[id]/page.tsx` | ✅ Implemented | Photo uploads for equipment and repairs with Firebase Storage, client-side compression, upload progress, RBAC-protected (admin/tech write, viewer read) |

#### Manuals Feature - QA Checklist

**Manual Testing Required (After Login to /manuals):**
- [ ] Upload PDF - File uploads to Firebase Storage and UI shows success
- [ ] Firestore doc created - Verify document in `manuals` collection has `downloadURL`, `storagePath`, `fileName`, `fileSize`, `mimeType`
- [ ] Preview opens PDF - Click eye icon opens PDF in new tab
- [ ] Download works - Click download icon downloads PDF file
- [ ] Search/filter works - Search by title/manufacturer, filter by type/manufacturer
- [ ] Delete removes both - Firestore document AND Storage object both deleted
- [ ] Stats update - Manual count updates after upload/delete (stats cards show: Total, Service Manuals, User Guides, Total Downloads)
- [ ] Loading states - Upload progress shown, loading skeletons during fetch
- [ ] Error handling - Invalid file types rejected, file size limits enforced (max 50MB, PDF only)

**Code Review Verified:**
- [x] Firebase Storage integration - `manual.service.ts` has upload/delete methods
- [x] Client component - `src/app/manuals/page.tsx` has "use client" directive
- [x] Error handling - Service returns AppError on failures
- [x] TypeScript types - All manual fields properly typed with Zod schemas
- [x] Stats cards - Real-time count updates implemented

#### HARP Inspections Feature - QA Checklist

**Manual Testing Required (After Login to /harp-inspections):**
- [ ] Create inspection → saved to Firestore - Fill form, submit, verify document created in `harp-inspections` collection with all fields
- [ ] History list loads - Navigate to `/harp-inspections` and verify list shows saved inspections
- [ ] Filters work - Test search by clinic/account/equipment, filter by status (Draft/Completed/Failed), filter by date range
- [ ] Detail view works - Click "View Details" on inspection, verify all data displayed correctly
- [ ] Regenerate PDF from saved data - Click "Regenerate PDF" button, verify PDF downloads with original inspection data
- [ ] Stats update - Stats cards show correct counts (Total, Completed, In Progress, Failed)
- [ ] Loading states - Skeletons shown during fetch, "Generating PDF" state during PDF creation
- [ ] Error handling - Validation errors shown on form, error states on failed loads
- [ ] Success feedback - Success message on save, redirect to history page after submission

**Code Review Verified:**
- [x] Firestore integration - `harp-inspection.service.ts` has CRUD methods
- [x] Client components - Both pages have "use client" directive
- [x] Error handling - Service returns AppError on failures
- [x] TypeScript types - All HARP fields properly typed with Zod schemas
- [x] Hook implementation - `useHarpInspections` supports create, update, regeneratePDF
- [x] PDF generation - API route at `/api/harp-inspection/pdf` generates PDFs
- [x] User context - Inspection saves with technicianId and createdBy fields

#### Notifications System - QA Checklist

**Manual Testing Required (After Login):**
- [ ] Bell icon visible - Top nav shows bell icon with/without badge
- [ ] Real-time badge count - Badge shows correct unread count, updates in real-time
- [ ] Dropdown opens - Click bell icon opens notification dropdown
- [ ] Notification list - Shows up to 10 recent notifications in scrollable area
- [ ] Empty state - Shows "No notifications" message when list is empty
- [ ] Unread indicators - Unread notifications have blue dot, blue background, bold title
- [ ] Mark as read - Individual "Mark read" button works, updates UI immediately
- [ ] Mark all read - "Mark all read" button marks all unread, updates badge count
- [ ] Navigation - Clicking notification navigates to related page (invoices, schedule, etc.)
- [ ] Time display - Shows relative time (e.g., "2h ago", "1d ago", "Just now")
- [ ] Visual badges - Warning and Error notifications show colored badges
- [ ] Scroll behavior - Notification list scrolls smoothly with custom scrollbar

**Generator Testing (Manual Trigger Required):**
- [ ] Overdue invoices - Create unpaid invoice with past due date → notification generated
- [ ] Upcoming appointments - Create appointment within 24h → notification generated
- [ ] No duplicate notifications - Running generator twice doesn't create duplicates
- [ ] Filtered correctly - Paid invoices and cancelled appointments don't trigger notifications

**Code Review Verified:**
- [x] Firestore integration - `notification.service.ts` has CRUD methods
- [x] Real-time hook - `useNotifications(true)` subscribes to Firestore updates
- [x] Generator service - `notification-generator.service.ts` isolated for future Cloud Function
- [x] TypeScript types - Notification model with body, relatedType, relatedId fields
- [x] UI components - TopNav has dropdown with scroll area
- [x] Error handling - Service returns AppError on failures
- [x] Mark read functionality - Individual and bulk mark as read implemented

#### Photo Uploads Feature - QA Checklist

**Manual Testing Required (After Login):**
- [ ] Equipment Photos - Navigate to equipment detail → Photos tab
- [ ] Upload equipment photo - Click "Upload Photo", select image, verify upload progress
- [ ] Photo appears in gallery - Verify photo displays in grid layout
- [ ] View photo - Click photo to open full-size viewer
- [ ] Delete equipment photo - Click delete button, confirm deletion
- [ ] Repair Photos - Navigate to equipment detail → Repair → Photos button
- [ ] Upload before photo - Upload photo to "Before" tab
- [ ] Upload after photo - Upload photo to "After" tab
- [ ] Photo tabs work - Switch between Before/After tabs
- [ ] View repair photo - Click photo to open viewer with before/after label
- [ ] Delete repair photo - Delete photo from repair photos dialog
- [ ] Image compression - Upload large image (>5MB), verify compressed to ~1MB
- [ ] File validation - Try uploading non-image file, verify rejection
- [ ] File size limit - Try uploading >10MB file, verify rejection
- [ ] Upload progress - Verify progress bar shows during upload
- [ ] RBAC - Viewer role cannot upload/delete photos
- [ ] RBAC - Admin/tech can upload/delete photos
- [ ] Metadata - Verify uploaded by name and date shown on photos
- [ ] Storage - Verify files stored at correct paths in Firebase Storage

**Code Review Verified:**
- [x] Firebase Storage integration - `photo.service.ts` has upload/delete methods
- [x] Client-side compression - `browser-image-compression` compresses to 1MB, 1920px max
- [x] File validation - Max 10MB, JPEG/PNG/WebP only
- [x] Upload progress - Progress callback implemented
- [x] Storage paths - equipment/{equipmentId}/photos/{photoId}.jpg, repairs/{repairId}/photos/{photoId}.jpg
- [x] Firestore metadata - uploadedAt, uploadedBy, contentType, size, storagePath, downloadURL
- [x] Photo gallery component - Grid view with upload, view, delete
- [x] Repair photos component - Before/After tabs with upload, view, delete
- [x] Equipment detail integration - Photo gallery in "Photos & Documents" tab
- [x] Repair photos dialog - Accessible from each repair card
- [x] RBAC enforcement - Admin/tech can upload/delete, viewer read-only
- [x] TypeScript types - Photo model properly typed
- [x] Error handling - AppError on upload/delete failures
- [x] Image dimensions - Width/height captured for photos

### 🚧 In Progress

| Module | File(s) | Status | Notes |
|--------|---------|--------|-------|

### ❌ Not Started (Still Using Hardcoded Data)

| Module | File(s) | Status | Notes |
|--------|---------|--------|-------|
| Schedule | `src/app/schedule/page.tsx` | ❌ Pending | Uses hardcoded appointments data |
| Parts/Inventory | `src/app/parts/page.tsx`, `src/app/inventory/page.tsx` | ❌ Pending | Uses hardcoded parts data |

## Data Layer Infrastructure

### Available Services (`src/lib/services/`)
- ✅ `base.ts` - Generic CRUD service with pagination and real-time support
- ✅ `client.service.ts` - Client/account management
- ✅ `equipment.service.ts` - Equipment management with QR code support
- ✅ `invoice.service.ts` - Invoice management with auto-numbering
- ✅ `part.service.ts` - Parts inventory management
- ✅ `repair.service.ts` - Equipment repair tracking
- ✅ `schedule.service.ts` - Appointment scheduling
- ✅ `manual.service.ts` - Equipment manuals
- ✅ `notification.service.ts` - User notifications
- ✅ `harp-inspection.service.ts` - HARP inspections
- ✅ `service-history.service.ts` - Service records

### Available React Hooks (`src/lib/hooks/`)
- ✅ `useClient` - Client/account data fetching and CRUD
- ✅ `useEquipment` - Equipment data with QR code lookup
- ✅ `useInvoice` / `useInvoices` - Invoice management
- ✅ `usePart` - Parts inventory
- ✅ `useRepair` - Equipment repair tracking and management
- ✅ `useSchedule` / `useTodayAppointments` - Schedule management
- ✅ `useManual` - Manuals
- ✅ `useNotification` / `useUnreadNotifications` - Notifications
- ✅ `useHarpInspection` - HARP inspections
- ✅ `useServiceHistory` - Service history
- ✅ `useDashboard` - Aggregated dashboard data

## Migration Guidelines

When migrating a module:

1. **Replace hardcoded data arrays** with service/hook calls
2. **Add loading and error states** with skeletons and fallback UI
3. **Implement pagination** for list views (limit + "Load more" button)
4. **Keep UI/UX identical** to preserve user experience
5. **Add real-time listeners** where appropriate (dashboard, notifications)
6. **Update this tracker** when migration is complete

## RBAC and Security

### Role-Based Access Control
The application implements three user roles:

- **Admin**: Full access to all features, including user management
- **Tech**: Can create, edit, and delete operational data (accounts, equipment, repairs, invoices, HARP inspections, schedules, manuals)
- **Viewer**: Read-only access to all data

### Firestore Security Rules
Security rules are defined in `firestore.rules` and enforce role-based access patterns:

- **Users collection**: Users can read their own document; admins can read/update all users
- **Operational collections**: All authenticated users can read; admin and tech can write
- **Notifications**: Users can read/update their own; admins/techs can create; admins can delete

Deploy rules via Firebase CLI:
```bash
firebase deploy --only firestore:rules,storage:rules
```

See `RBAC_SETUP.md` for complete documentation.

### AuthContext Helpers
The `AuthContext` provides role-checking helpers:
- `hasRole(roles)`: Check if user has one of the specified roles
- `isAdmin()`: Check if user is admin
- `isTech()`: Check if user is tech
- `isViewer()`: Check if user is viewer

### User Management
Admin users can manage roles via `/settings/users` page.

## Notes

- All services support pagination via `getAll(filters, { limit, orderByField, orderByDirection })`
- All hooks return `{ data, loading, error, create, update, remove }` interface
- Use `Skeleton` component from shadcn/ui for loading states
- Real-time subscriptions available via `subscribeToCollection` in `BaseService`
- User roles enforced client-side (AuthContext) and server-side (Firestore rules)
