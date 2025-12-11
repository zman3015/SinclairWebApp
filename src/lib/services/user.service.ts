import { collection, doc, updateDoc, query, where, getDocs, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { User, UserRoleType } from '@/lib/models/user'
import { BaseService, ServiceResult, ServiceListResult } from './base'
import { formatFirebaseError, logError } from '@/lib/firebase/errors'

export class UserService extends BaseService<User> {
  constructor() {
    super('users')
  }

  /**
   * Update a user's role (admin only)
   */
  async updateUserRole(userId: string, newRole: UserRoleType, updatedBy?: string): Promise<ServiceResult<void>> {
    try {
      const userRef = doc(db, this.collectionName, userId)
      await updateDoc(userRef, {
        role: newRole,
        updatedAt: Timestamp.now(),
        updatedBy
      })
      return { data: undefined }
    } catch (error) {
      logError('UserService.updateUserRole', error)
      return { error: formatFirebaseError(error) }
    }
  }

  /**
   * Get all users (admin only)
   */
  async getAllUsers(): Promise<ServiceListResult<User>> {
    try {
      const result = await this.getAll()
      if (result.error) {
        return { error: result.error }
      }
      return { data: result.data?.items || [] }
    } catch (error) {
      logError('UserService.getAllUsers', error)
      return { error: formatFirebaseError(error) }
    }
  }

  /**
   * Search users by email
   */
  async searchByEmail(email: string): Promise<ServiceListResult<User>> {
    try {
      const usersRef = collection(db, this.collectionName)
      const q = query(usersRef, where('email', '>=', email), where('email', '<=', email + '\uf8ff'))
      const snapshot = await getDocs(q)
      const users = snapshot.docs.map(doc => this.converter.fromFirestore(doc))
      return { data: users }
    } catch (error) {
      logError('UserService.searchByEmail', error)
      return { error: formatFirebaseError(error) }
    }
  }
}

export const userService = new UserService()
