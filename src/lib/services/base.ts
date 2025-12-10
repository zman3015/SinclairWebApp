import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  onSnapshot,
  type Query,
  type DocumentData,
  type QueryConstraint,
  type Unsubscribe,
  type WhereFilterOp,
  type OrderByDirection
} from 'firebase/firestore'
import { db } from '../firebase/config'
import { formatFirebaseError, logError, type AppError } from '../firebase/errors'
import { createConverter } from '../firebase/converters'
import type { BaseDocument } from '../models/shared'

export interface PaginationOptions {
  limit?: number
  startAfter?: unknown
  orderByField?: string
  orderByDirection?: OrderByDirection
}

export interface PaginatedResult<T> {
  items: T[]
  lastDoc: unknown
  hasMore: boolean
}

export interface QueryFilter {
  field: string
  operator: WhereFilterOp
  value: unknown
}

export interface ServiceResult<T> {
  data?: T
  error?: AppError
}

export interface ServiceListResult<T> {
  data?: T[]
  error?: AppError
}

/**
 * Base service class with common CRUD operations
 */
export class BaseService<T extends BaseDocument> {
  protected collectionName: string
  protected converter = createConverter<T>()

  constructor(collectionName: string) {
    this.collectionName = collectionName
  }

  /**
   * Get collection reference with converter
   */
  protected getCollectionRef() {
    return collection(db, this.collectionName).withConverter(this.converter)
  }

  /**
   * Get document reference with converter
   */
  protected getDocRef(id: string) {
    return doc(db, this.collectionName, id).withConverter(this.converter)
  }

  /**
   * Create a new document
   */
  async create(data: Omit<T, keyof BaseDocument>, userId?: string): Promise<ServiceResult<T>> {
    try {
      const docData = {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        createdBy: userId,
        updatedBy: userId
      }

      const docRef = await addDoc(collection(db, this.collectionName), docData)
      const created = await this.getById(docRef.id)

      if (created.error) {
        return { error: created.error }
      }

      return { data: created.data }
    } catch (error) {
      const appError = formatFirebaseError(error)
      logError(`${this.collectionName}.create`, error)
      return { error: appError }
    }
  }

  /**
   * Get document by ID
   */
  async getById(id: string): Promise<ServiceResult<T>> {
    try {
      const docRef = this.getDocRef(id)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        return {
          error: {
            code: 'not-found',
            message: `${this.collectionName} not found`
          }
        }
      }

      return { data: docSnap.data() }
    } catch (error) {
      const appError = formatFirebaseError(error)
      logError(`${this.collectionName}.getById`, error)
      return { error: appError }
    }
  }

  /**
   * Get all documents with optional filters and pagination
   */
  async getAll(
    filters?: QueryFilter[],
    pagination?: PaginationOptions
  ): Promise<ServiceResult<PaginatedResult<T>>> {
    try {
      const constraints: QueryConstraint[] = []

      // Add filters
      if (filters) {
        filters.forEach(filter => {
          constraints.push(where(filter.field, filter.operator, filter.value))
        })
      }

      // Add ordering
      if (pagination?.orderByField) {
        constraints.push(
          orderBy(pagination.orderByField, pagination.orderByDirection || 'asc')
        )
      }

      // Add pagination
      if (pagination?.startAfter) {
        constraints.push(startAfter(pagination.startAfter))
      }

      if (pagination?.limit) {
        constraints.push(limit(pagination.limit + 1)) // Fetch one extra to check hasMore
      }

      const q = query(this.getCollectionRef(), ...constraints)
      const querySnapshot = await getDocs(q)

      const items: T[] = []
      querySnapshot.forEach(doc => {
        items.push(doc.data())
      })

      // Check if there are more items
      const hasMore = pagination?.limit ? items.length > pagination.limit : false
      if (hasMore) {
        items.pop() // Remove the extra item
      }

      const lastDoc = items.length > 0 ? querySnapshot.docs[items.length - 1] : null

      return {
        data: {
          items,
          lastDoc,
          hasMore
        }
      }
    } catch (error) {
      const appError = formatFirebaseError(error)
      logError(`${this.collectionName}.getAll`, error)
      return { error: appError }
    }
  }

  /**
   * Update document by ID
   */
  async update(
    id: string,
    data: Partial<Omit<T, 'id' | 'createdAt' | 'createdBy'>>,
    userId?: string
  ): Promise<ServiceResult<T>> {
    try {
      const docRef = doc(db, this.collectionName, id)

      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now(),
        updatedBy: userId
      })

      const updated = await this.getById(id)
      return updated
    } catch (error) {
      const appError = formatFirebaseError(error)
      logError(`${this.collectionName}.update`, error)
      return { error: appError }
    }
  }

  /**
   * Delete document by ID
   */
  async delete(id: string): Promise<ServiceResult<void>> {
    try {
      const docRef = doc(db, this.collectionName, id)
      await deleteDoc(docRef)
      return { data: undefined }
    } catch (error) {
      const appError = formatFirebaseError(error)
      logError(`${this.collectionName}.delete`, error)
      return { error: appError }
    }
  }

  /**
   * Subscribe to real-time updates for a document
   */
  subscribeToDoc(
    id: string,
    onData: (data: T | null) => void,
    onError?: (error: AppError) => void
  ): Unsubscribe {
    const docRef = this.getDocRef(id)

    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          onData(snapshot.data())
        } else {
          onData(null)
        }
      },
      (error) => {
        const appError = formatFirebaseError(error)
        logError(`${this.collectionName}.subscribeToDoc`, error)
        if (onError) {
          onError(appError)
        }
      }
    )
  }

  /**
   * Subscribe to real-time updates for a collection
   */
  subscribeToCollection(
    onData: (data: T[]) => void,
    onError?: (error: AppError) => void,
    filters?: QueryFilter[]
  ): Unsubscribe {
    let q: Query<T, DocumentData> = this.getCollectionRef()

    if (filters) {
      const constraints: QueryConstraint[] = filters.map(filter =>
        where(filter.field, filter.operator, filter.value)
      )
      q = query(q, ...constraints) as Query<T, DocumentData>
    }

    return onSnapshot(
      q,
      (snapshot) => {
        const items: T[] = []
        snapshot.forEach(doc => {
          items.push(doc.data())
        })
        onData(items)
      },
      (error) => {
        const appError = formatFirebaseError(error)
        logError(`${this.collectionName}.subscribeToCollection`, error)
        if (onError) {
          onError(appError)
        }
      }
    )
  }

  /**
   * Count documents with optional filters
   */
  async count(filters?: QueryFilter[]): Promise<ServiceResult<number>> {
    try {
      const result = await this.getAll(filters)
      if (result.error) {
        return { error: result.error }
      }
      return { data: result.data?.items.length || 0 }
    } catch (error) {
      const appError = formatFirebaseError(error)
      logError(`${this.collectionName}.count`, error)
      return { error: appError }
    }
  }
}
