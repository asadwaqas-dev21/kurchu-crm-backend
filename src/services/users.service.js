/**
 * Users Service
 * Business logic for user management and permissions.
 *
 * @module services/users
 */

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const userRepository = require('../repositories/user.repository');
const emailService = require('./email.service');
const permissionsService = require('./permissions.service');
const { SALT_ROUNDS } = require('../utils/constants');
const {
  NotFoundError,
  ConflictError,
  AuthorizationError,
} = require('../utils/errors');

class UsersService {
  /**
   * Get all users for a company (paginated, filterable).
   * @param {string} companyId
   * @param {object} options - { skip, limit, role, isActive }
   */
  async getAll(companyId, options = {}) {
    return userRepository.findByCompany(companyId, options);
  }

  /**
   * Get a user by ID.
   * @param {string} userId
   * @param {string} companyId - Ensure same company
   */
  async getById(userId, companyId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User');
    }

    if (user.companyId !== companyId) {
      throw new AuthorizationError('You cannot access this user');
    }

    const { password, resetToken, resetTokenExpiry, ...sanitized } = user;
    return sanitized;
  }

  /**
   * Create a new user (admin-only).
   * Generates a temporary password and sends welcome email.
   * @param {string} companyId
   * @param {object} data
   */
  async create(companyId, data) {
    // Check if email already exists
    const existing = await userRepository.findByEmail(data.email);
    if (existing) {
      throw new ConflictError('A user with this email already exists');
    }

    // Generate temporary password
    const tempPassword = this._generateTempPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, SALT_ROUNDS);

    // Get default permissions for the role
    const permissions = permissionsService.getDefaultPermissions(data.role);

    // Create user
    const user = await userRepository.create({
      ...data,
      password: hashedPassword,
      companyId,
      permissions,
    });

    // Send welcome email with temporary password
    try {
      await emailService.sendWelcomeEmail(data.email, data.firstName, tempPassword);
    } catch (error) {
      // Don't fail user creation if email fails
    }

    return { user, tempPassword };
  }

  /**
   * Update a user.
   * @param {string} userId
   * @param {string} companyId
   * @param {object} data
   */
  async update(userId, companyId, data) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User');
    }

    if (user.companyId !== companyId) {
      throw new AuthorizationError('You cannot modify this user');
    }

    return userRepository.update(userId, data);
  }

  /**
   * Delete (deactivate) a user.
   * @param {string} userId
   * @param {string} companyId
   * @param {string} requestingUserId - Prevent self-deletion
   */
  async delete(userId, companyId, requestingUserId) {
    if (userId === requestingUserId) {
      throw new AuthorizationError('You cannot delete your own account');
    }

    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User');
    }

    if (user.companyId !== companyId) {
      throw new AuthorizationError('You cannot delete this user');
    }

    return userRepository.delete(userId);
  }

  /**
   * Update user permissions.
   * @param {string} userId
   * @param {string} companyId
   * @param {string[]} permissions
   */
  async updatePermissions(userId, companyId, permissions) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User');
    }

    if (user.companyId !== companyId) {
      throw new AuthorizationError('You cannot modify this user');
    }

    return userRepository.update(userId, { permissions });
  }

  /**
   * Generate a temporary password (12 chars, mixed).
   * @returns {string}
   */
  _generateTempPassword() {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }
}

module.exports = new UsersService();
