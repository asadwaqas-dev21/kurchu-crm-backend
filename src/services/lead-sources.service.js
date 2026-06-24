/**
 * Lead Sources Service
 * Business logic for lead source management.
 *
 * @module services/lead-sources
 */

const leadSourceRepository = require('../repositories/lead-source.repository');
const {
  NotFoundError,
  ConflictError,
  AuthorizationError,
} = require('../utils/errors');

class LeadSourcesService {
  /**
   * Get all lead sources for a company.
   * @param {string} companyId
   */
  async getAll(companyId) {
    return leadSourceRepository.findByCompany(companyId);
  }

  /**
   * Create a new lead source.
   * @param {string} companyId
   * @param {object} data - { name }
   */
  async create(companyId, data) {
    // Check for duplicate name
    const exists = await leadSourceRepository.existsByName(companyId, data.name);
    if (exists) {
      throw new ConflictError(`Lead source '${data.name}' already exists`);
    }

    return leadSourceRepository.create({
      name: data.name,
      companyId,
    });
  }

  /**
   * Update a lead source.
   * @param {string} sourceId
   * @param {string} companyId
   * @param {object} data - { name }
   */
  async update(sourceId, companyId, data) {
    const source = await leadSourceRepository.findById(sourceId);
    if (!source) {
      throw new NotFoundError('Lead source');
    }

    if (source.companyId !== companyId) {
      throw new AuthorizationError('You cannot modify this lead source');
    }

    // Check for duplicate name (excluding current)
    if (data.name !== source.name) {
      const exists = await leadSourceRepository.existsByName(companyId, data.name);
      if (exists) {
        throw new ConflictError(`Lead source '${data.name}' already exists`);
      }
    }

    return leadSourceRepository.update(sourceId, data);
  }

  /**
   * Delete a lead source.
   * @param {string} sourceId
   * @param {string} companyId
   */
  async delete(sourceId, companyId) {
    const source = await leadSourceRepository.findById(sourceId);
    if (!source) {
      throw new NotFoundError('Lead source');
    }

    if (source.companyId !== companyId) {
      throw new AuthorizationError('You cannot delete this lead source');
    }

    return leadSourceRepository.delete(sourceId);
  }
}

module.exports = new LeadSourcesService();
