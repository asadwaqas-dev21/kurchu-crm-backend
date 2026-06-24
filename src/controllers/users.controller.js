/**
 * Users Controller
 * Handles user management and permissions requests.
 *
 * @module controllers/users
 */

const usersService = require('../services/users.service');
const { successResponse, paginatedResponse } = require('../utils/formatters');

class UsersController {
  /**
   * GET /api/users
   */
  async getAll(req, res) {
    const { skip = 0, limit = 50, role, isActive } = req.validatedQuery || req.query;

    const { users, total } = await usersService.getAll(req.companyId, {
      skip: parseInt(skip, 10),
      limit: parseInt(limit, 10),
      role,
      isActive,
    });

    res.status(200).json(
      paginatedResponse(users, total, parseInt(skip, 10), parseInt(limit, 10))
    );
  }

  /**
   * GET /api/users/:id
   */
  async getById(req, res) {
    const user = await usersService.getById(req.params.id, req.companyId);

    res.status(200).json(
      successResponse({ user }, 'User retrieved')
    );
  }

  /**
   * POST /api/users
   */
  async create(req, res) {
    const { user, tempPassword } = await usersService.create(
      req.companyId,
      req.validatedBody
    );

    res.status(201).json(
      successResponse({ user, tempPassword }, 'User created', 201)
    );
  }

  /**
   * PATCH /api/users/:id
   */
  async update(req, res) {
    const user = await usersService.update(
      req.params.id,
      req.companyId,
      req.validatedBody
    );

    res.status(200).json(
      successResponse({ user }, 'User updated')
    );
  }

  /**
   * DELETE /api/users/:id
   */
  async delete(req, res) {
    await usersService.delete(req.params.id, req.companyId, req.userId);

    res.status(200).json(
      successResponse(null, 'User deleted')
    );
  }

  /**
   * PATCH /api/users/:id/permissions
   */
  async updatePermissions(req, res) {
    const user = await usersService.updatePermissions(
      req.params.id,
      req.companyId,
      req.validatedBody.permissions
    );

    res.status(200).json(
      successResponse({ user }, 'Permissions updated')
    );
  }
}

module.exports = new UsersController();
