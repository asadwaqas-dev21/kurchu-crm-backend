/**
 * Authentication Middleware
 * Extracts and verifies JWT access token from Authorization header.
 * Attaches userId and companyId to the request object.
 *
 * @module middleware/auth
 */

const jwtService = require('../services/jwt.service');
const { prisma } = require('../config/database');
const { AuthenticationError } = require('../utils/errors');
const { catchAsync } = require('../utils/catch-async');

/**
 * Verify JWT access token and attach user context to request.
 */
const authenticate = catchAsync(async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AuthenticationError('No access token provided');
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    throw new AuthenticationError('No access token provided');
  }

  try {
    const decoded = jwtService.verifyToken(token, 'access');

    // Fetch user to ensure they still exist and are active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        companyId: true,
        isActive: true,
        permissions: true,
      },
    });

    if (!user) {
      throw new AuthenticationError('User no longer exists');
    }

    if (!user.isActive) {
      throw new AuthenticationError('Account has been deactivated');
    }

    // Attach user context to request
    req.userId = user.id;
    req.userEmail = user.email;
    req.userRole = user.role;
    req.companyId = user.companyId;
    req.userPermissions = user.permissions;
    
    // Also attach a full user object for easier access
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
      permissions: user.permissions,
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new AuthenticationError('Access token has expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new AuthenticationError('Invalid access token');
    }
    throw error;
  }
});

module.exports = { authenticate };
