# Firebase Setup Instructions

This application uses Firebase for authentication and database. Follow these steps to set up Firebase:

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Enter a project name (e.g., "dental-tech-portal")
4. Click "Continue" and follow the prompts

## 2. Enable Authentication

1. In Firebase Console, click "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Click on "Email/Password"
5. Toggle "Enable" to ON
6. Click "Save"

## 3. Create Firestore Database

1. In Firebase Console, click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (you can configure security rules later)
4. Select a location closest to your users
5. Click "Enable"

## 4. Get Your Firebase Configuration

1. In Firebase Console, click the gear icon (⚙️) next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps" section
4. Click the "</>" (Web) icon to add a web app
5. Enter an app nickname (e.g., "Dental Tech Portal Web")
6. Click "Register app"
7. Copy the configuration values

## 5. Configure Environment Variables

1. In your project root, copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and replace the values with your Firebase config:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your-actual-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-actual-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-actual-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-actual-app-id
   ```

## 6. Set Up Firestore Security Rules (Optional but Recommended)

1. Go to Firestore Database in Firebase Console
2. Click on the "Rules" tab
3. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Authenticated users can read all user profiles
    match /users/{userId} {
      allow read: if request.auth != null;
    }
    
    // Only authenticated users can access data
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

4. Click "Publish"

## 7. Create Demo Accounts (Optional)

You can create demo accounts through the signup page:

1. **Admin Account:**
   - Email: admin@alphadent.com
   - Password: admin123
   - Role: Admin

2. **User Account:**
   - Email: user@alphadent.com
   - Password: user123
   - Role: User

## 8. Test the Application

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to http://localhost:3000
3. You should be redirected to the login page
4. Try signing up for a new account
5. After signup, you should be redirected to the dashboard

## Account Types

### Admin Account
- Full access to all features
- Can manage all clients and equipment
- Access to reports and settings
- Can view all service history

### User Account (Technician)
- Access to assigned service tickets
- Can view equipment and schedules
- Limited access to client management
- Can create service records

## Troubleshooting

### "Firebase: Error (auth/invalid-api-key)"
- Check that your API key in `.env.local` is correct
- Make sure there are no extra spaces or quotes

### "Firebase: Error (auth/operation-not-allowed)"
- Enable Email/Password authentication in Firebase Console

### "Missing or insufficient permissions"
- Check your Firestore security rules
- Make sure you're logged in

### Database not saving data
- Check that Firestore is enabled
- Verify your environment variables are loaded
- Restart your development server after changing `.env.local`

## Need Help?

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
