import { FirebaseError } from 'firebase/app'

export interface AppError {
  code: string
  message: string
  details?: unknown
}

/**
 * Convert Firebase errors to user-friendly messages
 */
export function formatFirebaseError(error: unknown): AppError {
  if (error instanceof FirebaseError) {
    const message = getFirebaseErrorMessage(error.code)
    return {
      code: error.code,
      message,
      details: error
    }
  }

  if (error instanceof Error) {
    return {
      code: 'unknown',
      message: error.message,
      details: error
    }
  }

  return {
    code: 'unknown',
    message: 'An unexpected error occurred',
    details: error
  }
}

/**
 * Map Firebase error codes to user-friendly messages
 */
function getFirebaseErrorMessage(code: string): string {
  const errorMessages: Record<string, string> = {
    // Auth errors
    'auth/email-already-in-use': 'This email is already registered',
    'auth/invalid-email': 'Invalid email address',
    'auth/operation-not-allowed': 'Operation not allowed',
    'auth/weak-password': 'Password is too weak',
    'auth/user-disabled': 'This account has been disabled',
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Incorrect password',
    'auth/too-many-requests': 'Too many attempts. Please try again later',

    // Firestore errors
    'permission-denied': 'You do not have permission to perform this action',
    'not-found': 'The requested resource was not found',
    'already-exists': 'This resource already exists',
    'resource-exhausted': 'Quota exceeded. Please try again later',
    'failed-precondition': 'Operation cannot be performed',
    'aborted': 'Operation was aborted',
    'out-of-range': 'Operation out of valid range',
    'unimplemented': 'Operation not implemented',
    'internal': 'Internal server error',
    'unavailable': 'Service temporarily unavailable',
    'data-loss': 'Unrecoverable data loss',
    'unauthenticated': 'Please sign in to continue',

    // Storage errors
    'storage/unauthorized': 'Unauthorized to access storage',
    'storage/canceled': 'Upload cancelled',
    'storage/unknown': 'Unknown storage error occurred'
  }

  return errorMessages[code] || `An error occurred: ${code}`
}

/**
 * Log error with context for debugging
 */
export function logError(context: string, error: unknown): void {
  const formattedError = formatFirebaseError(error)
  console.error(`❌ [${context}]`, {
    code: formattedError.code,
    message: formattedError.message,
    details: formattedError.details
  })
}
