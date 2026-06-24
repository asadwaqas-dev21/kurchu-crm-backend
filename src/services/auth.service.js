/**
 * Auth Service
 * Business logic for registration, login, token refresh, and password reset.
 *
 * @module services/auth
 */

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const userRepository = require('../repositories/user.repository');
const companyRepository = require('../repositories/company.repository');
const jwtService = require('./jwt.service');
const emailService = require('./email.service');
const permissionsService = require('./permissions.service');
const { SALT_ROUNDS, ROLES } = require('../utils/constants');
const {
  AuthenticationError,
  ConflictError,
  NotFoundError,
  ValidationError,
} = require('../utils/errors');

class AuthService {
  /**
   * Register a new user with a new company.
   * @param {object} data - Registration data
   */
  async register(data) {
    const { email, password, firstName, lastName, phone, companyName } = data;

    // Check if email already exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictError('An account with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create company
    const company = await companyRepository.create({
      name: companyName,
      email: email,
    });

    // Create user as ADMIN (first user in company)
    const defaultPermissions = permissionsService.getDefaultPermissions(ROLES.ADMIN);

    const user = await userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone: phone || null,
      role: ROLES.ADMIN,
      companyId: company.id,
      permissions: defaultPermissions,
    });

    // Generate tokens
    const tokens = jwtService.generateTokenPair(user.id);

    // Update last login
    await userRepository.updateLastLogin(user.id);

    return {
      user: this._sanitizeUser(user),
      ...tokens,
    };
  }

  /**
   * Login with email and password.
   * @param {object} data - { email, password }
   */
  async login({ email, password }) {
    // Find user (include password for verification)
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AuthenticationError('Account has been deactivated');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Generate tokens
    const tokens = jwtService.generateTokenPair(user.id);

    // Update last login
    await userRepository.updateLastLogin(user.id);

    return {
      user: this._sanitizeUser(user),
      ...tokens,
    };
  }

  /**
   * Refresh access token using refresh token.
   * @param {string} refreshToken
   */
  async refreshToken(refreshToken) {
    try {
      const decoded = jwtService.verifyToken(refreshToken, 'refresh');

      // Verify user still exists and is active
      const user = await userRepository.findById(decoded.userId);
      if (!user || !user.isActive) {
        throw new AuthenticationError('Invalid refresh token');
      }

      // Generate new access token
      const accessToken = jwtService.generateAccessToken(user.id);

      return { accessToken };
    } catch (error) {
      if (error instanceof AuthenticationError) throw error;
      throw new AuthenticationError('Invalid or expired refresh token');
    }
  }

  /**
   * Send password reset email.
   * @param {string} email
   */
  async forgotPassword(email) {
    const user = await userRepository.findByEmail(email);

    // Always return success (don't reveal if email exists)
    if (!user) return;

    // Generate reset token
    const resetToken = uuidv4();
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await userRepository.update(user.id, {
      resetToken,
      resetTokenExpiry,
    });

    // Send email
    await emailService.sendPasswordResetEmail(email, resetToken);
  }

  /**
   * Reset password using reset token.
   * @param {object} data - { token, newPassword }
   */
  async resetPassword({ token, newPassword }) {
    const user = await userRepository.findByResetToken(token);

    if (!user) {
      throw new ValidationError('Invalid or expired reset token');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    // Update password and clear reset token
    await userRepository.update(user.id, {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    });
  }

  /**
   * Get current user profile.
   * @param {string} userId
   */
  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User');
    }

    return this._sanitizeUser(user);
  }

  /**
   * Update current user profile.
   * @param {string} userId
   * @param {object} data - Fields to update
   */
  async updateProfile(userId, data) {
    const user = await userRepository.update(userId, data);
    return this._sanitizeUser(user);
  }

  /**
   * Remove sensitive fields from user object.
   * @param {object} user
   * @returns {object}
   */
  _sanitizeUser(user) {
    const { password, resetToken, resetTokenExpiry, ...sanitized } = user;
    return sanitized;
  }
}

module.exports = new AuthService();
