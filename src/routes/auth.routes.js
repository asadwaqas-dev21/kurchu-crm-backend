/**
 * Auth Routes
 * All authentication endpoints.
 *
 * @module routes/auth
 */

const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validateBody } = require('../middleware/validation.middleware');
const { authLimiter } = require('../middleware/rate-limit.middleware');
const {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
} = require('../schemas/auth.schema');

const router = Router();

// Public routes (with rate limiting)
router.post(
  '/register',
  authLimiter,
  validateBody(registerSchema),
  authController.register.bind(authController)
);

router.post(
  '/login',
  authLimiter,
  validateBody(loginSchema),
  authController.login.bind(authController)
);

router.post(
  '/refresh-token',
  validateBody(refreshTokenSchema),
  authController.refreshToken.bind(authController)
);

router.post(
  '/forgot-password',
  authLimiter,
  validateBody(forgotPasswordSchema),
  authController.forgotPassword.bind(authController)
);

router.post(
  '/reset-password',
  authLimiter,
  validateBody(resetPasswordSchema),
  authController.resetPassword.bind(authController)
);

// Authenticated routes
router.post(
  '/logout',
  authenticate,
  authController.logout.bind(authController)
);

router.get(
  '/me',
  authenticate,
  authController.getMe.bind(authController)
);

router.patch(
  '/update-profile',
  authenticate,
  validateBody(updateProfileSchema),
  authController.updateProfile.bind(authController)
);

module.exports = router;
