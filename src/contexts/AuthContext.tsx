"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

interface UserData {
  uid: string
  email: string
  displayName: string
  role: 'admin' | 'user'
  companyName?: string
  phone?: string
  createdAt: string
}

interface AuthContextType {
  user: User | null
  userData: UserData | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, displayName: string, role: 'admin' | 'user', companyName?: string, phone?: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {}
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('🔥 Setting up auth listener...')

    // Set a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.log('⚠️ Auth timeout - forcing loading to false')
      setLoading(false)
    }, 5000) // 5 second timeout

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      clearTimeout(timeout)
      console.log('🔥 Auth state changed:', user ? `User: ${user.email}` : 'No user')
      setUser(user)

      if (user) {
        try {
          console.log('📡 Fetching user data from Firestore...')
          // Fetch user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid))
          if (userDoc.exists()) {
            console.log('✅ User data loaded:', userDoc.data())
            setUserData(userDoc.data() as UserData)
          } else {
            console.log('⚠️ No user data found in Firestore')
            setUserData(null)
          }
        } catch (error) {
          console.error('❌ Error fetching user data:', error)
          setUserData(null)
        }
      } else {
        setUserData(null)
      }

      setLoading(false)
      console.log('✅ Loading complete')
    }, (error) => {
      clearTimeout(timeout)
      console.error('❌ Auth state change error:', error)
      setLoading(false)
    })

    return () => {
      clearTimeout(timeout)
      unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signUp = async (
    email: string,
    password: string,
    displayName: string,
    role: 'admin' | 'user',
    companyName?: string,
    phone?: string
  ) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Update display name
    await updateProfile(user, { displayName })

    // Create user document in Firestore
    const userData: UserData = {
      uid: user.uid,
      email: user.email!,
      displayName,
      role,
      companyName,
      phone,
      createdAt: new Date().toISOString()
    }

    await setDoc(doc(db, 'users', user.uid), userData)
  }

  const signOut = async () => {
    await firebaseSignOut(auth)
  }

  const value = {
    user,
    userData,
    loading,
    signIn,
    signUp,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
