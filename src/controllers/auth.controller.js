/**
 * Auth Controller
 * Handles all authentication HTTP requests.
 * Thin controller — delegates to AuthService.
 *
 * @module controllers/auth
 */

const authService = require('../services/auth.service');
const { successResponse } = require('../utils/formatters');

class AuthController {
  /**
   * POST /api/auth/register
   */
  async register(req, res) {
    const result = await authService.register(req.validatedBody);

    res.status(201).json(
      successResponse(result, 'Registration successful', 201)
    );
  }

  /**
   * POST /api/auth/login
   */
  async login(req, res) {
    const result = await authService.login(req.validatedBody);

    res.status(200).json(
      successResponse(result, 'Login successful')
    );
  }

  /**
   * POST /api/auth/refresh-token
   */
  async refreshToken(req, res) {
    const { refreshToken } = req.validatedBody;
    const result = await authService.refreshToken(refreshToken);

    res.status(200).json(
      successResponse(result, 'Token refreshed')
    );
  }

  /**
   * POST /api/auth/logout
   */
  async logout(_req, res) {
    // Stateless JWT — client should discard tokens
    res.status(200).json(
      successResponse(null, 'Logged out successfully')
    );
  }

  /**
   * POST /api/auth/forgot-password
   */
  async forgotPassword(req, res) {
    await authService.forgotPassword(req.validatedBody.email);

    // Always return success (don't reveal if email exists)
    res.status(200).json(
      successResponse(null, 'If the email exists, a reset link has been sent')
    );
  }

  /**
   * POST /api/auth/reset-password
   */
  async resetPassword(req, res) {
    await authService.resetPassword(req.validatedBody);

    res.status(200).json(
      successResponse(null, 'Password reset successfully')
    );
  }

  /**
   * GET /api/auth/me
   */
  async getMe(req, res) {
    const user = await authService.getProfile(req.userId);

    res.status(200).json(
      successResponse({ user }, 'Profile retrieved')
    );
  }

  /**
   * PATCH /api/auth/update-profile
   */
  async updateProfile(req, res) {
    const user = await authService.updateProfile(req.userId, req.validatedBody);

    res.status(200).json(
      successResponse({ user }, 'Profile updated')
    );
  }

  /**
   * GET /api/auth/notification-settings
   */
  async getNotificationSettings(req, res) {
    const settings = await authService.getNotificationSettings(req.userId);

    res.status(200).json(
      successResponse(settings, 'Notification settings retrieved')
    );
  }

  /**
   * PUT /api/auth/notification-settings
   */
  async updateNotificationSettings(req, res) {
    const settings = await authService.updateNotificationSettings(req.userId, req.validatedBody);

    res.status(200).json(
      successResponse(settings, 'Notification settings updated')
    );
  }
}

module.exports = new AuthController();
