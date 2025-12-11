/**
 * Custom error class for application errors
 */
export class AppError extends Error {
  code: string

  constructor(message: string, code: string = 'UNKNOWN_ERROR') {
    super(message)
    this.name = 'AppError'
    this.code = code

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError)
    }
  }
}
