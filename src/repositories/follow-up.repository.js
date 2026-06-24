/**
 * Follow-Up Repository
 * Data access layer for FollowUp model operations.
 *
 * @module repositories/follow-up
 */

const { prisma } = require('../config/database');

class FollowUpRepository {
  /**
   * Find follow-ups for a company within a date range.
   * @param {string} companyId
   * @param {Date} from
   * @param {Date} [to]
   */
  async findByDateRange(companyId, from, to = null) {
    const where = {
      lead: { companyId },
      scheduledAt: { gte: from },
    };
    if (to) where.scheduledAt.lte = to;

    return prisma.followUp.findMany({
      where,
      select: {
        id: true,
        scheduledAt: true,
        isCompleted: true,
        completedAt: true,
      },
    });
  }

  /**
   * Count completed follow-ups for a company in a date range.
   * @param {string} companyId
   * @param {Date} from
   */
  async countCompletedByDate(companyId, from) {
    return prisma.followUp.count({
      where: {
        lead: { companyId },
        isCompleted: true,
        completedAt: { gte: from },
      },
    });
  }

  /**
   * Count overdue follow-ups (scheduled before now, not completed).
   * @param {string} companyId
   */
  async countOverdue(companyId) {
    return prisma.followUp.count({
      where: {
        lead: { companyId },
        isCompleted: false,
        scheduledAt: { lt: new Date() },
      },
    });
  }

  /**
   * Find all follow-ups for a company.
   * @param {string} companyId
   * @param {object} filter Options
   */
  async findAll(companyId, filter = {}) {
    return prisma.followUp.findMany({
      where: { lead: { companyId }, ...filter },
      include: {
        lead: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            company: true,
          }
        }
      },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  /**
   * Find follow-up by ID.
   * @param {string} id
   * @param {string} companyId
   */
  async findById(id, companyId) {
    return prisma.followUp.findFirst({
      where: { id, lead: { companyId } },
      include: {
        lead: true,
      },
    });
  }

  /**
   * Create a new follow-up.
   * @param {object} data
   */
  async create(data) {
    return prisma.followUp.create({
      data,
      include: {
        lead: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            company: true,
          }
        }
      }
    });
  }

  /**
   * Update a follow-up.
   * @param {string} id
   * @param {string} companyId
   * @param {object} data
   */
  async update(id, companyId, data) {
    // Need to verify it belongs to company
    const exists = await this.findById(id, companyId);
    if (!exists) return null;

    return prisma.followUp.update({
      where: { id },
      data,
      include: {
        lead: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            company: true,
          }
        }
      }
    });
  }

  /**
   * Delete a follow-up.
   * @param {string} id
   * @param {string} companyId
   */
  async delete(id, companyId) {
    const exists = await this.findById(id, companyId);
    if (!exists) return null;

    return prisma.followUp.delete({
      where: { id },
    });
  }
}

module.exports = new FollowUpRepository();
