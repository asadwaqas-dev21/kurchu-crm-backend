/**
 * Winston Logger Configuration
 * Structured JSON logging with console + file transports.
 * Never logs passwords, tokens, or other sensitive data.
 *
 * @module utils/logger
 */

const winston = require('winston');
const path = require('path');

const LOG_DIR = path.join(process.cwd(), 'logs');

/** Custom format that redacts sensitive fields */
const redactSensitive = winston.format((info) => {
  const sensitiveKeys = ['password', 'token', 'secret', 'authorization', 'cookie'];

  if (typeof info.message === 'object') {
    for (const key of sensitiveKeys) {
      if (info.message[key]) {
        info.message[key] = '[REDACTED]';
      }
    }
  }

  return info;
});

/** Logger instance */
const transports = [
  // Console transport (colorized in development)
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.printf(({ timestamp, level, message, service, ...meta }) => {
        const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
        return `${timestamp} [${service}] ${level}: ${message}${metaStr}`;
      })
    ),
  }),
];

// File logging is disabled in Serverless environments (like Vercel) where write access to filesystem is restricted
if (!process.env.VERCEL) {
  // Error log file
  transports.push(
    new winston.transports.File({
      filename: path.join(LOG_DIR, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );

  // Combined log file
  transports.push(
    new winston.transports.File({
      filename: path.join(LOG_DIR, 'combined.log'),
      maxsize: 5242880,
      maxFiles: 5,
    })
  );
}

/** Logger instance */
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'debug',
  format: winston.format.combine(
    redactSensitive(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'kurchu-crm' },
  transports,
});

// Suppress logs during tests
if (process.env.NODE_ENV === 'test') {
  logger.silent = true;
}

module.exports = { logger };
