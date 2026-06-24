/**
 * Lead Sources Controller
 * Handles lead source management requests.
 *
 * @module controllers/lead-sources
 */

const leadSourcesService = require('../services/lead-sources.service');
const { successResponse } = require('../utils/formatters');

class LeadSourcesController {
  /**
   * GET /api/lead-sources
   */
  async getAll(req, res) {
    const sources = await leadSourcesService.getAll(req.companyId);

    res.status(200).json(
      successResponse({ sources }, 'Lead sources retrieved')
    );
  }

  /**
   * POST /api/lead-sources
   */
  async create(req, res) {
    const source = await leadSourcesService.create(
      req.companyId,
      req.validatedBody
    );

    res.status(201).json(
      successResponse({ source }, 'Lead source created', 201)
    );
  }

  /**
   * PATCH /api/lead-sources/:id
   */
  async update(req, res) {
    const source = await leadSourcesService.update(
      req.params.id,
      req.companyId,
      req.validatedBody
    );

    res.status(200).json(
      successResponse({ source }, 'Lead source updated')
    );
  }

  /**
   * DELETE /api/lead-sources/:id
   */
  async delete(req, res) {
    await leadSourcesService.delete(req.params.id, req.companyId);

    res.status(200).json(
      successResponse(null, 'Lead source deleted')
    );
  }
}

module.exports = new LeadSourcesController();
