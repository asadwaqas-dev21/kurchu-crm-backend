/**
 * Company Service
 * Business logic for company profile and service management.
 *
 * @module services/company
 */

const companyRepository = require('../repositories/company.repository');
const { NotFoundError, AuthorizationError } = require('../utils/errors');

class CompanyService {
  /**
   * Get company profile by ID.
   * @param {string} companyId
   */
  async getProfile(companyId) {
    const company = await companyRepository.findById(companyId);
    if (!company) {
      throw new NotFoundError('Company');
    }
    return company;
  }

  /**
   * Update company profile.
   * @param {string} companyId
   * @param {object} data
   */
  async updateProfile(companyId, data) {
    const company = await companyRepository.findById(companyId);
    if (!company) {
      throw new NotFoundError('Company');
    }

    return companyRepository.update(companyId, data);
  }

  /**
   * Get all services for a company.
   * @param {string} companyId
   */
  async getServices(companyId) {
    return companyRepository.findServices(companyId);
  }

  /**
   * Create a new service.
   * @param {string} companyId
   * @param {object} data
   */
  async createService(companyId, data) {
    return companyRepository.createService({
      ...data,
      companyId,
    });
  }

  /**
   * Update a service.
   * @param {string} serviceId
   * @param {string} companyId - For ownership verification
   * @param {object} data
   */
  async updateService(serviceId, companyId, data) {
    const service = await companyRepository.findServiceById(serviceId);
    if (!service) {
      throw new NotFoundError('Service');
    }

    if (service.companyId !== companyId) {
      throw new AuthorizationError('You cannot modify this service');
    }

    return companyRepository.updateService(serviceId, data);
  }

  /**
   * Delete a service.
   * @param {string} serviceId
   * @param {string} companyId - For ownership verification
   */
  async deleteService(serviceId, companyId) {
    const service = await companyRepository.findServiceById(serviceId);
    if (!service) {
      throw new NotFoundError('Service');
    }

    if (service.companyId !== companyId) {
      throw new AuthorizationError('You cannot delete this service');
    }

    return companyRepository.deleteService(serviceId);
  }
}

module.exports = new CompanyService();
