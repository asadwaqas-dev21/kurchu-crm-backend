/**
 * Lead Repository
 * Data access layer for Lead model operations.
 *
 * @module repositories/lead
 */

const { prisma } = require('../config/database');

class LeadRepository {
  /**
   * Count all leads for a company.
   * @param {string} companyId
   */
  async countByCompany(companyId) {
    return prisma.lead.count({ where: { companyId } });
  }

  /**
   * Count leads created within a date range.
   * @param {string} companyId
   * @param {Date} from
   * @param {Date} [to]
   */
  async countByDateRange(companyId, from, to = new Date()) {
    return prisma.lead.count({
      where: {
        companyId,
        createdAt: { gte: from, lte: to },
      },
    });
  }

  /**
   * Count leads by stage.
   * @param {string} companyId
   * @param {string} stage
   */
  async countByStage(companyId, stage) {
    return prisma.lead.count({
      where: { companyId, stage },
    });
  }

  /**
   * Get lead counts grouped by stage.
   * @param {string} companyId
   */
  async countGroupedByStage(companyId) {
    return prisma.lead.groupBy({
      by: ['stage'],
      where: { companyId },
      _count: { id: true },
    });
  }

  /**
   * Get leads created per period for chart data.
   * @param {string} companyId
   * @param {Date} from
   * @param {Date} to
   */
  async findByDateRange(companyId, from, to) {
    return prisma.lead.findMany({
      where: {
        companyId,
        createdAt: { gte: from, lte: to },
      },
      select: {
        id: true,
        stage: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Find all leads for a company with pagination.
   * @param {string} companyId
   * @param {object} options Filter and pagination options (skip, limit, stage, assignedToId, etc.)
   */
  async findAll(companyId, options = {}) {
    const { skip, limit, ...filter } = options;

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where: { companyId, ...filter },
        include: {
          source: true,
          assignedTo: { select: { id: true, firstName: true, lastName: true } }
        },
        ...(skip !== undefined && { skip: parseInt(skip, 10) }),
        ...(limit !== undefined && { take: parseInt(limit, 10) }),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.lead.count({
        where: { companyId, ...filter }
      })
    ]);

    return { leads, total };
  }

  /**
   * Find lead by ID.
   * @param {string} id
   * @param {string} companyId
   */
  async findById(id, companyId) {
    return prisma.lead.findFirst({
      where: { id, companyId },
      include: {
        source: true,
        assignedTo: { select: { id: true, firstName: true, lastName: true } },
        notes: true,
        followUps: true,
      },
    });
  }

  /**
   * Create a new lead.
   * @param {object} data
   */
  async create(data) {
    return prisma.lead.create({
      data,
      include: {
        source: true,
      },
    });
  }

  /**
   * Update a lead.
   * @param {string} id
   * @param {string} companyId
   * @param {object} data
   */
  async update(id, companyId, data) {
    return prisma.lead.updateMany({
      where: { id, companyId },
      data,
    });
  }

  /**
   * Delete a lead.
   * @param {string} id
   * @param {string} companyId
   */
  async delete(id, companyId) {
    const bookings = await prisma.booking.findMany({
      where: { leadId: id },
    });
    const bookingIds = bookings.map((b) => b.id);

    if (bookingIds.length > 0) {
      await prisma.invoice.deleteMany({
        where: { bookingId: { in: bookingIds } },
      });
      await prisma.payment.deleteMany({
        where: { bookingId: { in: bookingIds } },
      });
      await prisma.booking.deleteMany({
        where: { id: { in: bookingIds } },
      });
    }

    await prisma.alert.deleteMany({
      where: {
        OR: [
          { leadId: id },
          { bookingId: { in: bookingIds } },
        ],
      },
    });

    return prisma.lead.deleteMany({
      where: { id, companyId },
    });
  }
}

module.exports = new LeadRepository();
