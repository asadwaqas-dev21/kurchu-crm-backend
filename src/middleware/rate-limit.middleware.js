/**
 * Rate Limiting Middleware
 * Configurable rate limiters for auth and general endpoints.
 *
 * @module middleware/rate-limit
 */

const rateLimit = require('express-rate-limit');

/** Passthrough middleware for test environment */
const passthrough = (_req, _res, next) => next();
const isTest = process.env.NODE_ENV === 'test';

/**
 * Auth rate limiter — strict limit for login/register/password endpoints.
 * 5 requests per 15 minutes per IP.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX, 10) || 5,
  message: {
    success: false,
    error: {
      message: 'Too many authentication attempts, please try again after 15 minutes',
      statusCode: 429,
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip,
});

/**
 * General API rate limiter — 100 requests per 15 minutes per IP.
 */
const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  message: {
    success: false,
    error: {
      message: 'Too many requests, please try again later',
      statusCode: 429,
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  authLimiter: isTest ? passthrough : authLimiter,
  generalLimiter: isTest ? passthrough : generalLimiter,
};
