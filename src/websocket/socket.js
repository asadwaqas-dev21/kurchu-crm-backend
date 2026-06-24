/**
 * Socket.io Initialization
 * WebSocket server with JWT authentication and company rooms.
 *
 * @module websocket/socket
 */

const { Server } = require('socket.io');
const jwtService = require('../services/jwt.service');
const { prisma } = require('../config/database');
const { logger } = require('../utils/logger');
const { setupDashboardHandlers } = require('./dashboard.socket');

/**
 * Initialize Socket.io server.
 * @param {import('http').Server} httpServer
 * @returns {import('socket.io').Server}
 */
const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // JWT authentication middleware for WebSocket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.query.token;

      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = jwtService.verifyToken(token, 'access');
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, companyId: true, role: true, isActive: true },
      });

      if (!user || !user.isActive) {
        return next(new Error('User not found or inactive'));
      }

      socket.userId = user.id;
      socket.companyId = user.companyId;
      socket.userRole = user.role;

      next();
    } catch (error) {
      logger.warn('WebSocket auth failed:', { error: error.message });
      next(new Error('Invalid token'));
    }
  });

  // Connection handler
  io.on('connection', (socket) => {
    const { userId, companyId } = socket;

    logger.info(`🔌 WebSocket connected: ${userId}`);

    // Join company room for broadcasts
    socket.join(`company:${companyId}`);

    // Setup dashboard event handlers
    setupDashboardHandlers(io, socket);

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      logger.info(`🔌 WebSocket disconnected: ${userId} (${reason})`);
      socket.leave(`company:${companyId}`);
    });

    // Handle errors
    socket.on('error', (error) => {
      logger.error('WebSocket error:', { userId, error: error.message });
    });
  });

  logger.info('🔌 WebSocket server initialized');

  return io;
};

/**
 * Broadcast a metrics update to all company members.
 * @param {import('socket.io').Server} io
 * @param {string} companyId
 * @param {object} metrics
 */
const broadcastMetricsUpdate = (io, companyId, metrics) => {
  io.to(`company:${companyId}`).emit('metrics:update', metrics);
};

/**
 * Broadcast a new alert to all company members.
 * @param {import('socket.io').Server} io
 * @param {string} companyId
 * @param {object} alert
 */
const broadcastNewAlert = (io, companyId, alert) => {
  io.to(`company:${companyId}`).emit('alert:new', alert);
};

/**
 * Broadcast a new lead creation to all company members.
 * @param {import('socket.io').Server} io
 * @param {string} companyId
 * @param {object} lead
 */
const broadcastLeadCreated = (io, companyId, lead) => {
  io.to(`company:${companyId}`).emit('lead:created', lead);
};

/**
 * Broadcast a booking confirmation to all company members.
 * @param {import('socket.io').Server} io
 * @param {string} companyId
 * @param {object} booking
 */
const broadcastBookingConfirmed = (io, companyId, booking) => {
  io.to(`company:${companyId}`).emit('booking:confirmed', booking);
};

module.exports = {
  initializeSocket,
  broadcastMetricsUpdate,
  broadcastNewAlert,
  broadcastLeadCreated,
  broadcastBookingConfirmed,
};
