/**
 * Alert Repository
 * Data access layer for Alert model operations.
 *
 * @module repositories/alert
 */

const { prisma } = require('../config/database');

class AlertRepository {
  /**
   * Find alerts for a company (paginated, newest first).
   * @param {string} companyId
   * @param {number} [skip=0]
   * @param {number} [limit=10]
   */
  async findByCompany(companyId, skip = 0, limit = 10) {
    const [alerts, total, unread] = await Promise.all([
      prisma.alert.findMany({
        where: { companyId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.alert.count({ where: { companyId } }),
      prisma.alert.count({ where: { companyId, isRead: false } }),
    ]);

    return { alerts, total, unread };
  }

  /**
   * Create a new alert.
   * @param {object} data
   */
  async create(data) {
    return prisma.alert.create({ data });
  }

  /**
   * Mark an alert as read.
   * @param {string} id
   */
  async markAsRead(id) {
    return prisma.alert.update({
      where: { id },
      data: { isRead: true, readAt: new Date() },
    });
  }

  /**
   * Mark all alerts as read for a company.
   * @param {string} companyId
   */
  async markAllAsRead(companyId) {
    return prisma.alert.updateMany({
      where: { companyId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
  }

  /**
   * Count unread alerts for a company.
   * @param {string} companyId
   */
  async countUnread(companyId) {
    return prisma.alert.count({
      where: { companyId, isRead: false },
    });
  }
}

module.exports = new AlertRepository();
