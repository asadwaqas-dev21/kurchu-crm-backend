/**
 * Authorization Middleware
 * Role-based and permission-based access control.
 *
 * @module middleware/authorize
 */

const { AuthorizationError } = require('../utils/errors');

/**
 * Restrict access to specific roles.
 *
 * @param  {...string} allowedRoles - Roles allowed to access the route
 * @returns {Function} Express middleware
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, _res, next) => {
    if (!req.userRole) {
      throw new AuthorizationError('User role not found');
    }

    if (!allowedRoles.includes(req.userRole)) {
      throw new AuthorizationError(
        `Role '${req.userRole}' is not authorized to access this resource`
      );
    }

    next();
  };
};

/**
 * Restrict access to users with specific permissions.
 *
 * @param  {...string} requiredPermissions - Permissions required
 * @returns {Function} Express middleware
 */
const authorizePermissions = (...requiredPermissions) => {
  return (req, _res, next) => {
    // Admins bypass permission checks
    if (req.userRole === 'ADMIN') {
      return next();
    }

    const userPermissions = req.userPermissions || [];
    const hasAllPermissions = requiredPermissions.every(
      (perm) => userPermissions.includes(perm)
    );

    if (!hasAllPermissions) {
      throw new AuthorizationError(
        'You do not have the required permissions for this action'
      );
    }

    next();
  };
};

module.exports = { authorizeRoles, authorizePermissions };
