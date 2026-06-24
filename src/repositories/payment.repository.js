/**
 * Payment Repository
 * Data access layer for Payment model operations.
 *
 * @module repositories/payment
 */

const { prisma } = require('../config/database');

class PaymentRepository {
  /**
   * Find all payments for a company.
   * @param {string} companyId
   */
  async findByCompany(companyId) {
    return prisma.payment.findMany({
      where: { booking: { companyId } },
      select: {
        id: true,
        amount: true,
        method: true,
        paidAt: true,
      },
    });
  }

  /**
   * Sum all payments for a company (total revenue).
   * @param {string} companyId
   */
  async sumByCompany(companyId) {
    const result = await prisma.payment.aggregate({
      where: { booking: { companyId } },
      _sum: { amount: true },
    });
    return result._sum.amount || 0;
  }

  /**
   * Find payments within a date range for chart data.
   * @param {string} companyId
   * @param {Date} from
   * @param {Date} to
   */
  async findByDateRange(companyId, from, to) {
    return prisma.payment.findMany({
      where: {
        booking: { companyId },
        paidAt: { gte: from, lte: to },
      },
      select: {
        id: true,
        amount: true,
        paidAt: true,
      },
      orderBy: { paidAt: 'asc' },
    });
  }
}

module.exports = new PaymentRepository();
