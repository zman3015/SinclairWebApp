# How to Set Up Your Firestore Security Rules

## Quick Setup (Copy-Paste Method)

1. **Go to Firebase Console Rules Editor:**
   - Open: https://console.firebase.google.com/project/dentech-sap/firestore/rules
   
2. **Copy the rules from `firestore.rules` file**

3. **Paste into the Firebase Console editor**

4. **Click "Publish"**

That's it! Your database is now secure.

---

## What These Rules Do

### 🔐 Security Features:

**Authentication Required:**
- ✅ All operations require user to be logged in
- ❌ Unauthenticated users cannot read or write anything

**Role-Based Access:**
- **Admin Users** - Can delete anything
- **Regular Users** - Can create/update but not delete (except their own profile)
- **All Users** - Can read data they need for the app

### 📋 Collections Covered:

| Collection | Who Can Read | Who Can Create/Update | Who Can Delete |
|------------|--------------|----------------------|----------------|
| `users` | All authenticated | Own profile only | Admins only |
| `clients` | All authenticated | Admins only | Admins only |
| `equipment` | All authenticated | All authenticated | Admins only |
| `services` | All authenticated | All authenticated | Admins only |
| `invoices` | All authenticated | All authenticated | Admins only |
| `inventory` | All authenticated | All authenticated | Admins only |
| `parts` | All authenticated | All authenticated | Admins only |
| `manuals` | All authenticated | All authenticated | Admins only |
| `schedules` | All authenticated | All authenticated | Admins only |
| `qrcodes` | All authenticated | All authenticated | Admins only |

---

## Testing Your Rules

After setting up the rules:

1. **Create an account** (use the signup page)
2. **Try logging in**
3. **Try creating some data** (add a client, equipment, etc.)
4. **Check if it saves** to Firestore

---

## Troubleshooting

**"Missing or insufficient permissions" error:**
- Make sure you're logged in
- Check that you published the rules
- Wait 30 seconds for rules to propagate

**Rules won't save:**
- Check for syntax errors (red underlines in editor)
- Make sure you clicked "Publish" not just save

**Can't read/write data:**
- Verify you're authenticated (check console logs)
- Make sure the collection name matches the rules

---

## Security Notes

 **What's Protected:**
- Only logged-in users can access data
- Users can only edit their own profile
- Admins have full control
- No public access to any data

 **Important:**
- These rules expire in production mode
- Test mode allows all access for 30 days
- After 30 days, switch to these rules

- Keep your repository private (credentials are included)
- Don't share your Firebase credentials publicly
- Monitor your Firebase usage regularly

---

## Need Help?

If rules aren't working:
1. Check the Firebase Console > Firestore > Rules tab
2. Look for error messages in red
3. Make sure you clicked "Publish"
4. Try the Firestore Rules Simulator to test specific operations
