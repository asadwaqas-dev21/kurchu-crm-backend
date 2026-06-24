/**
 * Lead Source Repository
 * Data access layer for LeadSource model operations.
 *
 * @module repositories/lead-source
 */

const { prisma } = require('../config/database');

class LeadSourceRepository {
  /**
   * Find all lead sources for a company.
   * @param {string} companyId
   */
  async findByCompany(companyId) {
    return prisma.leadSource.findMany({
      where: { companyId },
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { leads: true },
        },
      },
    });
  }

  /**
   * Find a lead source by ID.
   * @param {string} id
   */
  async findById(id) {
    return prisma.leadSource.findUnique({ where: { id } });
  }

  /**
   * Check if a lead source name already exists for a company.
   * @param {string} companyId
   * @param {string} name
   */
  async existsByName(companyId, name) {
    const source = await prisma.leadSource.findUnique({
      where: {
        companyId_name: { companyId, name },
      },
    });
    return !!source;
  }

  /**
   * Create a new lead source.
   * @param {object} data
   */
  async create(data) {
    return prisma.leadSource.create({ data });
  }

  /**
   * Update a lead source.
   * @param {string} id
   * @param {object} data
   */
  async update(id, data) {
    return prisma.leadSource.update({ where: { id }, data });
  }

  /**
   * Delete a lead source.
   * @param {string} id
   */
  async delete(id) {
    return prisma.leadSource.delete({ where: { id } });
  }
}

module.exports = new LeadSourceRepository();
