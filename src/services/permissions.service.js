/**
 * Permissions Service
 * Permission checking and default role permissions.
 *
 * @module services/permissions
 */

const { DEFAULT_ROLE_PERMISSIONS, ROLES } = require('../utils/constants');

class PermissionsService {
  /**
   * Check if a user has a specific permission.
   * @param {string} userRole
   * @param {string[]} userPermissions
   * @param {string} requiredPermission
   * @returns {boolean}
   */
  hasPermission(userRole, userPermissions, requiredPermission) {
    // Admins have all permissions
    if (userRole === ROLES.ADMIN) return true;

    return userPermissions.includes(requiredPermission);
  }

  /**
   * Check if a user has ALL of the specified permissions.
   * @param {string} userRole
   * @param {string[]} userPermissions
   * @param {string[]} requiredPermissions
   * @returns {boolean}
   */
  hasAllPermissions(userRole, userPermissions, requiredPermissions) {
    if (userRole === ROLES.ADMIN) return true;

    return requiredPermissions.every((perm) => userPermissions.includes(perm));
  }

  /**
   * Check if a user has ANY of the specified permissions.
   * @param {string} userRole
   * @param {string[]} userPermissions
   * @param {string[]} requiredPermissions
   * @returns {boolean}
   */
  hasAnyPermission(userRole, userPermissions, requiredPermissions) {
    if (userRole === ROLES.ADMIN) return true;

    return requiredPermissions.some((perm) => userPermissions.includes(perm));
  }

  /**
   * Get default permissions for a role.
   * @param {string} role
   * @returns {string[]}
   */
  getDefaultPermissions(role) {
    return DEFAULT_ROLE_PERMISSIONS[role] || [];
  }
}

module.exports = new PermissionsService();
