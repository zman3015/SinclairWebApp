import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

console.log('🔥 Firebase Config:', {
  apiKey: firebaseConfig.apiKey ? '✅ Set' : '❌ Missing',
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId
})

// Initialize Firebase only once
const app: FirebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
console.log('🔥 Firebase app initialized')

const auth: Auth = getAuth(app)
console.log('🔥 Firebase Auth initialized')

const db: Firestore = getFirestore(app)
console.log('🔥 Firestore initialized')

// Initialize Storage only in browser (uses browser-only APIs)
let storage: FirebaseStorage | null = null
const getStorageInstance = (): FirebaseStorage => {
  if (typeof window === 'undefined') {
    throw new Error('Firebase Storage can only be accessed in the browser')
  }
  if (!storage) {
    storage = getStorage(app)
    console.log('🔥 Storage initialized')
  }
  return storage
}

// Initialize Analytics only in browser and if supported
let analytics: Analytics | null = null
if (typeof window !== 'undefined') {
  isSupported().then(yes => {
    if (yes) {
      analytics = getAnalytics(app)
    }
  }).catch(() => {
    // Analytics not supported, continue without it
  })
}

export { app, auth, db, getStorageInstance, analytics }
