/**
 * Company Controller
 * Handles company profile and service management requests.
 *
 * @module controllers/company
 */

const companyService = require('../services/company.service');
const { successResponse } = require('../utils/formatters');

class CompanyController {
  /**
   * GET /api/company/profile
   */
  async getProfile(req, res) {
    const company = await companyService.getProfile(req.companyId);

    res.status(200).json(
      successResponse({ company }, 'Company profile retrieved')
    );
  }

  /**
   * PATCH /api/company/profile
   */
  async updateProfile(req, res) {
    const company = await companyService.updateProfile(
      req.companyId,
      req.validatedBody
    );

    res.status(200).json(
      successResponse({ company }, 'Company profile updated')
    );
  }

  /**
   * GET /api/company/services
   */
  async getServices(req, res) {
    const services = await companyService.getServices(req.companyId);

    res.status(200).json(
      successResponse({ services }, 'Services retrieved')
    );
  }

  /**
   * POST /api/company/services
   */
  async createService(req, res) {
    const service = await companyService.createService(
      req.companyId,
      req.validatedBody
    );

    res.status(201).json(
      successResponse({ service }, 'Service created', 201)
    );
  }

  /**
   * PATCH /api/company/services/:id
   */
  async updateService(req, res) {
    const service = await companyService.updateService(
      req.params.id,
      req.companyId,
      req.validatedBody
    );

    res.status(200).json(
      successResponse({ service }, 'Service updated')
    );
  }

  /**
   * DELETE /api/company/services/:id
   */
  async deleteService(req, res) {
    await companyService.deleteService(req.params.id, req.companyId);

    res.status(200).json(
      successResponse(null, 'Service deleted')
    );
  }
}

module.exports = new CompanyController();
