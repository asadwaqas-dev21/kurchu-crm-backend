/**
 * Request/Response Logger Middleware
 * Logs incoming requests and outgoing responses with timing.
 *
 * @module middleware/logger
 */

const { logger } = require('../utils/logger');

/**
 * Log HTTP requests with method, path, status, and duration.
 */
const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  // Log request
  logger.http(`→ ${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  // Log response on finish
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const level = res.statusCode >= 400 ? 'warn' : 'http';

    logger[level](`← ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`, {
      statusCode: res.statusCode,
      duration,
      ip: req.ip,
    });
  });

  next();
};

module.exports = { requestLogger };
