/**
 * Company Repository
 * Data access layer for Company and Service model operations.
 *
 * @module repositories/company
 */

const { prisma } = require('../config/database');

class CompanyRepository {
  /**
   * Find company by ID.
   * @param {string} id
   */
  async findById(id) {
    return prisma.company.findUnique({ where: { id } });
  }

  /**
   * Find company by email.
   * @param {string} email
   */
  async findByEmail(email) {
    return prisma.company.findUnique({ where: { email } });
  }

  /**
   * Create a new company.
   * @param {object} data
   */
  async create(data) {
    return prisma.company.create({ data });
  }

  /**
   * Update company profile.
   * @param {string} id
   * @param {object} data
   */
  async update(id, data) {
    return prisma.company.update({ where: { id }, data });
  }

  // ─── Services ──────────────────────────────

  /**
   * Find all services for a company.
   * @param {string} companyId
   */
  async findServices(companyId) {
    return prisma.service.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find a service by ID.
   * @param {string} id
   */
  async findServiceById(id) {
    return prisma.service.findUnique({ where: { id } });
  }

  /**
   * Create a new service.
   * @param {object} data
   */
  async createService(data) {
    return prisma.service.create({ data });
  }

  /**
   * Update a service.
   * @param {string} id
   * @param {object} data
   */
  async updateService(id, data) {
    return prisma.service.update({ where: { id }, data });
  }

  /**
   * Delete a service.
   * @param {string} id
   */
  async deleteService(id) {
    return prisma.service.delete({ where: { id } });
  }
}

module.exports = new CompanyRepository();
