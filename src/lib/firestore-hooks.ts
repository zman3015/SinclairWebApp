// Firestore hooks for data persistence
import { useState, useEffect, useCallback } from 'react'
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore'
import { db } from './firebase'
import { useAuth } from '@/contexts/AuthContext'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GenericData = any

// Hook to save and load clients
export function useClients() {
  const [clients, setClients] = useState<GenericData[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      setClients([])
      setLoading(false)
      return
    }

    loadClients()
  }, [user])

  const loadClients = async () => {
    try {
      console.log('📡 Loading clients from Firestore...')
      const querySnapshot = await getDocs(collection(db, 'clients'))
      const clientsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      console.log('✅ Loaded clients:', clientsData.length)
      setClients(clientsData)
    } catch (error) {
      console.error('❌ Error loading clients:', error)
    } finally {
      setLoading(false)
    }
  }

  const addClient = async (clientData: GenericData) => {
    try {
      console.log('💾 Saving client to Firestore...')
      const docRef = await addDoc(collection(db, 'clients'), {
        ...clientData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      })
      console.log('✅ Client saved with ID:', docRef.id)
      await loadClients()
      return docRef.id
    } catch (error) {
      console.error('❌ Error saving client:', error)
      throw error
    }
  }

  const updateClient = async (clientId: string, clientData: GenericData) => {
    try {
      console.log('💾 Updating client in Firestore...')
      await updateDoc(doc(db, 'clients', clientId), {
        ...clientData,
        updatedAt: Timestamp.now()
      })
      console.log('✅ Client updated')
      await loadClients()
    } catch (error) {
      console.error('❌ Error updating client:', error)
      throw error
    }
  }

  const deleteClient = async (clientId: string) => {
    try {
      console.log('🗑️ Deleting client from Firestore...')
      await deleteDoc(doc(db, 'clients', clientId))
      console.log('✅ Client deleted')
      await loadClients()
    } catch (error) {
      console.error('❌ Error deleting client:', error)
      throw error
    }
  }

  return { clients, loading, addClient, updateClient, deleteClient, reload: loadClients }
}

// Hook to save and load equipment
export function useEquipment() {
  const [equipment, setEquipment] = useState<GenericData[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      setEquipment([])
      setLoading(false)
      return
    }

    loadEquipment()
  }, [user])

  const loadEquipment = async () => {
    try {
      console.log('📡 Loading equipment from Firestore...')
      const querySnapshot = await getDocs(collection(db, 'equipment'))
      const equipmentData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      console.log('✅ Loaded equipment:', equipmentData.length)
      setEquipment(equipmentData)
    } catch (error) {
      console.error('❌ Error loading equipment:', error)
    } finally {
      setLoading(false)
    }
  }

  const addEquipment = async (equipmentData: GenericData) => {
    try {
      console.log('💾 Saving equipment to Firestore...')
      const docRef = await addDoc(collection(db, 'equipment'), {
        ...equipmentData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      })
      console.log('✅ Equipment saved with ID:', docRef.id)
      await loadEquipment()
      return docRef.id
    } catch (error) {
      console.error('❌ Error saving equipment:', error)
      throw error
    }
  }

  const updateEquipment = async (equipmentId: string, equipmentData: GenericData) => {
    try {
      console.log('💾 Updating equipment in Firestore...')
      await updateDoc(doc(db, 'equipment', equipmentId), {
        ...equipmentData,
        updatedAt: Timestamp.now()
      })
      console.log('✅ Equipment updated')
      await loadEquipment()
    } catch (error) {
      console.error('❌ Error updating equipment:', error)
      throw error
    }
  }

  const deleteEquipment = async (equipmentId: string) => {
    try {
      console.log('🗑️ Deleting equipment from Firestore...')
      await deleteDoc(doc(db, 'equipment', equipmentId))
      console.log('✅ Equipment deleted')
      await loadEquipment()
    } catch (error) {
      console.error('❌ Error deleting equipment:', error)
      throw error
    }
  }

  return { equipment, loading, addEquipment, updateEquipment, deleteEquipment, reload: loadEquipment }
}

// Generic hook for any collection
export function useFirestoreCollection(collectionName: string) {
  const [data, setData] = useState<GenericData[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const loadData = useCallback(async () => {
    try {
      console.log(`📡 Loading ${collectionName} from Firestore...`)
      const querySnapshot = await getDocs(collection(db, collectionName))
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      console.log(`✅ Loaded ${collectionName}:`, items.length)
      setData(items)
    } catch (error) {
      console.error(`❌ Error loading ${collectionName}:`, error)
    } finally {
      setLoading(false)
    }
  }, [collectionName])

  useEffect(() => {
    if (!user) {
      setData([])
      setLoading(false)
      return
    }

    loadData()
  }, [user, loadData])

  const addItem = async (itemData: GenericData) => {
    try {
      console.log(`💾 Saving to ${collectionName}...`)
      const docRef = await addDoc(collection(db, collectionName), {
        ...itemData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      })
      console.log(`✅ Saved to ${collectionName} with ID:`, docRef.id)
      await loadData()
      return docRef.id
    } catch (error) {
      console.error(`❌ Error saving to ${collectionName}:`, error)
      throw error
    }
  }

  const updateItem = async (itemId: string, itemData: GenericData) => {
    try {
      console.log(`💾 Updating ${collectionName}...`)
      await updateDoc(doc(db, collectionName, itemId), {
        ...itemData,
        updatedAt: Timestamp.now()
      })
      console.log(`✅ Updated ${collectionName}`)
      await loadData()
    } catch (error) {
      console.error(`❌ Error updating ${collectionName}:`, error)
      throw error
    }
  }

  const deleteItem = async (itemId: string) => {
    try {
      console.log(`🗑️ Deleting from ${collectionName}...`)
      await deleteDoc(doc(db, collectionName, itemId))
      console.log(`✅ Deleted from ${collectionName}`)
      await loadData()
    } catch (error) {
      console.error(`❌ Error deleting from ${collectionName}:`, error)
      throw error
    }
  }

  return { data, loading, addItem, updateItem, deleteItem, reload: loadData }
}
