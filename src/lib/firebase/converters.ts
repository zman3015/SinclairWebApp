import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
  WithFieldValue
} from 'firebase/firestore'

export interface BaseFirestoreDocument {
  id?: string
  createdAt?: Date
  updatedAt?: Date
}

/**
 * Generic converter for Firestore documents with automatic date conversion
 */
export function createConverter<T extends BaseFirestoreDocument>(): FirestoreDataConverter<T> {
  return {
    toFirestore(data: WithFieldValue<T>): DocumentData {
      const { id, ...rest } = data as T
      return {
        ...rest,
        updatedAt: Timestamp.now()
      }
    },
    fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): T {
      const data = snapshot.data(options)
      return {
        ...data,
        id: snapshot.id,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      } as T
    }
  }
}

/**
 * Convert Firestore Timestamp to Date
 */
export function timestampToDate(timestamp: Timestamp | Date | null | undefined): Date | null {
  if (!timestamp) return null
  if (timestamp instanceof Date) return timestamp
  if (timestamp instanceof Timestamp) return timestamp.toDate()
  return null
}

/**
 * Convert Date to Firestore Timestamp
 */
export function dateToTimestamp(date: Date | null | undefined): Timestamp | null {
  if (!date) return null
  if (date instanceof Timestamp) return date
  return Timestamp.fromDate(date)
}
