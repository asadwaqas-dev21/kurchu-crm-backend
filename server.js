/**
 * Kurchu CRM — Server Entry Point
 * Loads environment, starts Express + Socket.io, connects to database.
 * Restart triggered.
 */

require('dotenv').config();

const http = require('http');
const app = require('./src/app');
const { env } = require('./src/config/env');
const { connectDatabase, disconnectDatabase } = require('./src/config/database');
const { initializeSocket } = require('./src/websocket/socket');
const { logger } = require('./src/utils/logger');

const PORT = env.PORT || 3001;

/** Create HTTP server and attach Socket.io */
const server = http.createServer(app);
const io = initializeSocket(server);

// Make io accessible to the app (for broadcasting from services)
app.set('io', io);

/**
 * Start the server.
 */
const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();

    // Start listening
    server.listen(PORT, () => {
      logger.info(`🚀 Kurchu CRM API running on port ${PORT}`);
      logger.info(`📍 Environment: ${env.NODE_ENV}`);
      logger.info(`🔗 Health check: http://localhost:${PORT}/api/health`);
      logger.info(`🔌 WebSocket: ws://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// ─── Graceful Shutdown ─────────────────────────

const gracefulShutdown = async (signal) => {
  logger.info(`\n${signal} received. Starting graceful shutdown...`);

  // Stop accepting new connections
  server.close(async () => {
    logger.info('HTTP server closed');

    // Disconnect database
    await disconnectDatabase();

    logger.info('✅ Graceful shutdown complete');
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('⚠️ Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection:', reason);
  process.exit(1);
});

// Start
startServer();

module.exports = server;
