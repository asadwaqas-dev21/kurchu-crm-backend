/**
 * Global Error Handler Middleware
 * Catches all errors and returns consistent JSON error responses.
 * Logs errors with Winston — never exposes internal details in production.
 *
 * @module middleware/error
 */

const { logger } = require('../utils/logger');
const { errorResponse } = require('../utils/formatters');
const { AppError } = require('../utils/errors');

/**
 * Global error handler — must be registered LAST in the middleware chain.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, _next) => {
  // Default to 500 Internal Server Error
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let details = null;

  // Handle known operational errors
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details || null;
  }

  // Handle Prisma errors
  if (err.code === 'P2002') {
    statusCode = 409;
    message = 'A record with this value already exists';
    const target = err.meta?.target;
    if (target) {
      message = `A record with this ${Array.isArray(target) ? target.join(', ') : target} already exists`;
    }
  }

  if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Record not found';
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token has expired';
  }

  // Log the error
  const logPayload = {
    statusCode,
    message,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userId: req.userId || 'anonymous',
  };

  if (statusCode >= 500) {
    logger.error({ ...logPayload, stack: err.stack });
  } else {
    logger.warn(logPayload);
  }

  // Send response — hide stack trace in production
  const response = errorResponse(message, statusCode, details);

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = { errorHandler };
