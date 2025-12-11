# Account Setup Guide

This guide will help you set up two accounts:
1. **Admin Account** - With test data (equipment, clients, invoices, etc.)
2. **User Account** - Empty/clean (to see the interface without data)

## Prerequisites

Before starting, make sure you have:
- ✅ Published Firestore security rules (see `FIRESTORE_RULES_SETUP.md`)
- ✅ Firebase Authentication enabled
- ✅ The application running locally or deployed

## Step 1: Create the Admin Account

### 1.1 Sign Up as Admin

1. Go to the **Sign Up** page
2. Fill in the form:
   - **Email:** admin@alphadent.com
   - **Password:** admin123
   - **Display Name:** Admin User
   - **Role:** Select **Admin**
   - **Company Name:** Alphadent (optional)
   - **Phone:** (optional)
3. Click **Sign Up**
4. You will be automatically logged in

### 1.2 Seed Test Data

1. Click on your profile avatar in the top-right corner
2. In the dropdown menu, click **"Seed Test Data"**
   - Note: This option only appears for admin users
3. Review the data that will be added:
   - ✅ 5 Clients/Accounts
   - ✅ 5 Equipment items with QR codes
   - ✅ 3 Invoices
   - ✅ 5 Inventory parts
   - ✅ 2 Service records
   - ✅ 3 Scheduled appointments
4. Click the **"Seed Test Data"** button
5. Wait for the success message

### 1.3 Verify Test Data

Navigate through different pages to see the populated data:

**Dashboard:**
- Should show 5 active clients
- Recent service tickets
- Upcoming appointments
- Equipment statistics

**Accounts Page:**
- Should show 5 client accounts:
  - Bright Smiles Dental (West, Platinum)
  - Family Dental Care (West, Gold)
  - Downtown Dental Group (South, Silver)
  - Coastal Dental Studio (West, Platinum)
  - Valley Dental Associates (North, Gold)

**Equipment/Scanner:**
- Go to Scanner → Generate QR Code
- You should see previously created equipment when searching

**Invoices:**
- Should show 3 invoices:
  - INV-2024-001 (Paid)
  - INV-2024-002 (Pending)
  - INV-2024-003 (Overdue)

**Inventory/Parts:**
- Should show 5 parts with different stock levels
- Some marked as "Low Stock"

**Schedule:**
- Should show 3 upcoming appointments

## Step 2: Create the User Account

### 2.1 Sign Out from Admin

1. Click profile avatar in top-right
2. Click **Sign Out**

### 2.2 Sign Up as User

1. Go to the **Sign Up** page
2. Fill in the form:
   - **Email:** user@alphadent.com
   - **Password:** user123
   - **Display Name:** Tech User
   - **Role:** Select **User**
   - **Company Name:** Alphadent (optional)
   - **Phone:** (optional)
3. Click **Sign Up**
4. You will be automatically logged in

### 2.3 Verify Empty Interface

Navigate through different pages to see the clean interface:

**Dashboard:**
- Should show empty state or zero values
- No recent activity
- Clean slate for new data

**Accounts Page:**
- Should show empty state
- "No clients found" message

**Equipment/Scanner:**
- Clean interface ready for new equipment registration

**Invoices:**
- Empty state
- Ready to create new invoices

**All other pages:**
- Should show empty/clean states
- Perfect for seeing the UI without data clutter

## Step 3: Test Both Accounts

### Test Admin Account Features:
1. View populated data across all pages
2. Generate new QR codes (they will be added to existing data)
3. View client profiles with map locations
4. Check route optimization with multiple clients
5. View service history and invoices
6. Check inventory with low stock alerts

### Test User Account Features:
1. Generate first QR code for equipment
2. Create first client
3. Add first invoice
4. Create first appointment
5. See how the interface looks as data is added incrementally

## Important Notes

⚠️ **ONLY seed test data for the ADMIN account**
- The user account should remain clean
- Each account only sees its own data
- Data is filtered by the `createdBy` user ID

⚠️ **Run seed data ONLY ONCE**
- Running it multiple times will create duplicate data
- If you need to reset, manually delete documents in Firebase Console

⚠️ **Firestore Security Rules Required**
- Make sure rules are published before creating accounts
- Users without proper permissions won't be able to save data

## Troubleshooting

### "Seed Test Data" option not showing
- Make sure you're logged in as an **admin** user
- Check that the role was set to "Admin" during signup
- Try signing out and back in

### Data not saving
- Verify Firestore security rules are published
- Check browser console for Firebase errors
- Ensure you're authenticated (logged in)

### Can't see test data
- Make sure you're logged in as the admin account
- Data is user-specific, so the user account won't see admin's data
- Check Firebase Console to verify data was created

### Duplicate data after seeding
- Only run seed data once per account
- If duplicates exist, delete them manually in Firebase Console
- Or create a new admin account and seed fresh data

## Demo Account Credentials

For quick reference:

**Admin Account (with test data):**
```
Email: admin@alphadent.com
Password: admin123
Role: Admin
```

**User Account (empty):**
```
Email: user@alphadent.com
Password: user123
Role: User
```

## Next Steps

After setting up both accounts:

1. ✅ Test all features with the admin account
2. ✅ Show the clean interface with the user account
3. ✅ Practice creating new data with the user account
4. ✅ Test route optimization with admin's multiple clients
5. ✅ Generate and scan QR codes
6. ✅ Create invoices and service records
7. ✅ Use the map view with populated locations

Enjoy exploring your Dental Tech Portal! 🦷✨
