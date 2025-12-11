# RBAC and Firestore Security Rules Setup

## Overview

This application implements Role-Based Access Control (RBAC) with three user roles:

- **Admin**: Full access to all features, including user management
- **Tech**: Can create, edit, and delete operational data (accounts, equipment, repairs, invoices, HARP inspections, schedules, manuals)
- **Viewer**: Read-only access to all data

## User Role Management

### Admin UI
Admins can manage user roles via the **User Management** page:
- Navigate to Settings dropdown → "User Management"
- Or visit `/settings/users`
- Change any user's role using the dropdown selector

### Initial Setup
When users sign up, they select their role from the signup form. The default role is `tech`.

## Firestore Security Rules

Security rules are defined in `firestore.rules` and enforce the following access patterns:

### Users Collection
- Users can read their own document
- Admins can read all user documents
- Only admins can update user roles
- Users can create their own document during signup
- Only admins can delete users

### Operational Collections
The following collections use the standard `canRead()` / `canWrite()` pattern:
- `clients` (accounts)
- `equipment`
- `repairs`
- `invoices`
- `harp-inspections`
- `schedules`
- `manuals`
- `service-history`
- `parts`

**Read Access**: All authenticated users (admin, tech, viewer)
**Write Access**: Admin and tech only

### Notifications Collection
- Users can read their own notifications
- Admins and techs can create notifications
- Users can update their own notifications (e.g., mark as read)
- Only admins can delete notifications

## Firebase Storage Rules

Defined in `storage.rules`:

### Manuals Directory (`/manuals/**`)
- **Read**: All authenticated users
- **Write**: Admin and tech only

### Profile Images (`/profile-images/**`)
- **Read**: All authenticated users
- **Write**: All authenticated users (can upload their own)

### HARP PDFs (`/harp-pdfs/**`)
- **Read**: All authenticated users
- **Write**: Admin and tech only

## Deploying Rules

### Prerequisites
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login to Firebase: `firebase login`
3. Set the project: `firebase use <project-id>`

### Deploy Security Rules
```bash
# Deploy Firestore rules only
firebase deploy --only firestore:rules

# Deploy Storage rules only
firebase deploy --only storage:rules

# Deploy both
firebase deploy --only firestore:rules,storage:rules
```

### Verify Deployment
After deploying, test the rules:
1. Login as a **viewer** user and verify you cannot create/edit data
2. Login as a **tech** user and verify you can create/edit operational data but cannot access user management
3. Login as an **admin** user and verify you can access user management and all features

## Code Implementation

### Auth Context
The `AuthContext` (`src/contexts/AuthContext.tsx`) provides:
- `hasRole(roles)`: Check if user has one of the specified roles
- `isAdmin()`: Check if user is admin
- `isTech()`: Check if user is tech
- `isViewer()`: Check if user is viewer

### Services
- `UserService` (`src/lib/services/user.service.ts`): Manage users and roles
- All other services inherit from `BaseService` which uses Firestore

### Hooks
- `useUsers()`: Fetch all users (admin only)
- `useUser(userId)`: Fetch a specific user
- Both hooks support role updates

## Testing RBAC

### Manual Test Checklist
1. **Admin User**
   - [ ] Can access `/settings/users` page
   - [ ] Can change user roles
   - [ ] Can create/edit/delete invoices
   - [ ] Can create/edit HARP inspections
   - [ ] Can upload/delete manuals

2. **Tech User**
   - [ ] Cannot access `/settings/users` page (redirects to home)
   - [ ] Can create/edit/delete invoices
   - [ ] Can create/edit HARP inspections
   - [ ] Can upload/delete manuals

3. **Viewer User**
   - [ ] Cannot access `/settings/users` page
   - [ ] Can view invoices but cannot create/edit/delete
   - [ ] Can view HARP inspections but cannot create/edit
   - [ ] Can view manuals but cannot upload/delete

## Security Notes

- **Never store sensitive data in client-side code**
- **Always validate on the server side** (Firestore rules)
- **Use HTTPS only** for production
- **Regularly audit user roles** and permissions
- **Implement logging** for admin actions (future enhancement)

## Troubleshooting

### Rules Not Working
1. Check if rules are deployed: `firebase firestore:rules:get`
2. View Storage rules: `firebase storage:rules:get`
3. Check browser console for permission errors
4. Verify user role in Firestore `users/{uid}` document

### User Can't Access Data
1. Verify user is authenticated
2. Check user role in `users/{uid}` document
3. Ensure rules are deployed correctly
4. Clear browser cache and re-login

### Admin Can't Manage Users
1. Verify admin role: `userData.role === 'admin'`
2. Check Firestore rules deployment
3. Verify `getUserRole()` function in rules is working
