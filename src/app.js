/**
 * Express Application
 * Assembles middleware stack, routes, and error handling.
 *
 * @module app
 */

require('express-async-errors');
const express = require('express');
const helmet = require('helmet');
const { corsMiddleware } = require('./middleware/cors.middleware');
const { requestLogger } = require('./middleware/logger.middleware');
const { generalLimiter } = require('./middleware/rate-limit.middleware');
const { errorHandler } = require('./middleware/error.middleware');
const routes = require('./routes/index.routes');

const app = express();

// ─── Security ────────────────────────────────
app.use(helmet());
app.use(corsMiddleware);

// ─── Body Parsing ────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Logging ─────────────────────────────────
app.use(requestLogger);

// ─── Rate Limiting ───────────────────────────
app.use(generalLimiter);

// ─── Health Check ────────────────────────────
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Kurchu CRM API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0',
  });
});

// ─── API Routes ──────────────────────────────
app.use('/api', routes);

// ─── 404 Handler ─────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Route not found',
      statusCode: 404,
    },
  });
});

// ─── Global Error Handler ────────────────────
app.use(errorHandler);

module.exports = app;
