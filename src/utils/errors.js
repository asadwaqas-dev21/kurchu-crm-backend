/**
 * Custom Error Classes
 * Standardized error hierarchy for consistent API error responses.
 *
 * @module utils/errors
 */

class AppError extends Error {
  /**
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   */
  constructor(message, statusCode) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  /**
   * @param {string} message - Validation error message
   * @param {Array} [details] - Validation error details
   */
  constructor(message, details = []) {
    super(message, 400);
    this.details = details;
  }
}

class AuthenticationError extends AppError {
  /** @param {string} [message] */
  constructor(message = 'Authentication failed') {
    super(message, 401);
  }
}

class AuthorizationError extends AppError {
  /** @param {string} [message] */
  constructor(message = 'Insufficient permissions') {
    super(message, 403);
  }
}

class NotFoundError extends AppError {
  /** @param {string} resource - Name of the resource that was not found */
  constructor(resource) {
    super(`${resource} not found`, 404);
    this.resource = resource;
  }
}

class ConflictError extends AppError {
  /** @param {string} message */
  constructor(message) {
    super(message, 409);
  }
}

class RateLimitError extends AppError {
  /** @param {string} [message] */
  constructor(message = 'Too many requests, please try again later') {
    super(message, 429);
  }
}

module.exports = {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
};
