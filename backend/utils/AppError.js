/**
 * Custom error class for handling application errors.
 *
 * This class extends the built-in Error class to provide additional
 * properties for operational errors in the application.
 */

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Indicates that the error is operational
    Error.captureStackTrace(this, this.constructor); // Captures the stack trace
  }
}

module.exports = AppError;
