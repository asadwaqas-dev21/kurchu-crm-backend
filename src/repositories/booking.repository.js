/**
 * Booking Repository
 * Data access layer for Booking model operations.
 *
 * @module repositories/booking
 */

const { prisma } = require('../config/database');

class BookingRepository {
  /**
   * Count bookings for a company.
   * @param {string} companyId
   * @param {object} [where] - Additional filters
   */
  async count(companyId, where = {}) {
    return prisma.booking.count({
      where: { companyId, ...where },
    });
  }

  /**
   * Count bookings within a date range.
   * @param {string} companyId
   * @param {Date} from
   * @param {Date} [to]
   */
  async countByDateRange(companyId, from, to = new Date()) {
    return prisma.booking.count({
      where: {
        companyId,
        createdAt: { gte: from, lte: to },
      },
    });
  }

  /**
   * Count bookings by status.
   * @param {string} companyId
   * @param {string} status
   * @param {Date} [from]
   */
  async countByStatus(companyId, status, from = null) {
    const where = { companyId, status };
    if (from) where.createdAt = { gte: from };
    return prisma.booking.count({ where });
  }

  /**
   * Get all bookings for a company (for amount calculations).
   * @param {string} companyId
   */
  async findByCompany(companyId) {
    return prisma.booking.findMany({
      where: { companyId },
      select: {
        id: true,
        amount: true,
        collectedAmount: true,
        pendingAmount: true,
        status: true,
        createdAt: true,
      },
    });
  }

  /**
   * Get bookings with amounts in a date range.
   * @param {string} companyId
   * @param {Date} from
   * @param {Date} to
   */
  async findByDateRange(companyId, from, to) {
    return prisma.booking.findMany({
      where: {
        companyId,
        createdAt: { gte: from, lte: to },
      },
      select: {
        id: true,
        amount: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }
}

module.exports = new BookingRepository();
