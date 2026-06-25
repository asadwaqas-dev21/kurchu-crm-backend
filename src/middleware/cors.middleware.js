/**
 * CORS Configuration Middleware
 * Configures Cross-Origin Resource Sharing from environment.
 *
 * @module middleware/cors
 */

const cors = require('cors');

/**
 * Build CORS options from environment configuration.
 *
 * @returns {import('cors').CorsOptions}
 */
const buildCorsOptions = () => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

  return {
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      const allowedOrigins = frontendUrl.split(',').map((url) => url.trim());

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow localhost on any port for testing and development of client apps
      if (origin.includes('localhost') || origin.includes('127.0.0.1') || origin.includes('::1')) {
        return callback(null, true);
      }

      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-Total-Count'],
    maxAge: 86400, // 24 hours preflight cache
  };
};

const corsMiddleware = cors(buildCorsOptions());

module.exports = { corsMiddleware, buildCorsOptions };
