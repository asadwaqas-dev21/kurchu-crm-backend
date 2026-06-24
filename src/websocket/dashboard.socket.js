/**
 * Dashboard WebSocket Handlers
 * Real-time dashboard subscription and event broadcasting.
 *
 * @module websocket/dashboard
 */

const { logger } = require('../utils/logger');
const dashboardService = require('../services/dashboard.service');

/**
 * Setup dashboard-specific WebSocket event handlers.
 * @param {import('socket.io').Server} io
 * @param {import('socket.io').Socket} socket
 */
const setupDashboardHandlers = (io, socket) => {
  const { companyId, userId } = socket;

  /**
   * Subscribe to real-time dashboard updates.
   * Sends initial metrics immediately, then joins a poll interval.
   */
  socket.on('dashboard:subscribe', async () => {
    try {
      logger.info(`📊 Dashboard subscription: ${userId}`);

      // Send initial metrics immediately
      const metrics = await dashboardService.getMetrics(companyId);
      socket.emit('metrics:update', metrics);

      // Join dashboard room for targeted updates
      socket.join(`dashboard:${companyId}`);
    } catch (error) {
      logger.error('Dashboard subscribe error:', { userId, error: error.message });
      socket.emit('error', { message: 'Failed to load dashboard metrics' });
    }
  });

  /**
   * Unsubscribe from dashboard updates.
   */
  socket.on('dashboard:unsubscribe', () => {
    logger.info(`📊 Dashboard unsubscribed: ${userId}`);
    socket.leave(`dashboard:${companyId}`);
  });

  /**
   * Request a manual refresh of dashboard metrics.
   */
  socket.on('dashboard:refresh', async () => {
    try {
      const metrics = await dashboardService.getMetrics(companyId);
      socket.emit('metrics:update', metrics);
    } catch (error) {
      logger.error('Dashboard refresh error:', { userId, error: error.message });
      socket.emit('error', { message: 'Failed to refresh metrics' });
    }
  });
};

module.exports = { setupDashboardHandlers };
