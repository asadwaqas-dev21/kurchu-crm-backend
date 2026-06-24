/**
 * User Repository
 * Data access layer for User model operations.
 *
 * @module repositories/user
 */

const { prisma } = require('../config/database');

class UserRepository {
  /**
   * Find user by ID.
   * @param {string} id
   * @param {object} [select] - Fields to select
   */
  async findById(id, select = null) {
    const options = { where: { id } };
    if (select) options.select = select;
    return prisma.user.findUnique(options);
  }

  /**
   * Find user by email.
   * @param {string} email
   */
  async findByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  }

  /**
   * Find user by password reset token.
   * @param {string} resetToken
   */
  async findByResetToken(resetToken) {
    return prisma.user.findFirst({
      where: {
        resetToken,
        resetTokenExpiry: { gt: new Date() },
      },
    });
  }

  /**
   * Create a new user.
   * @param {object} data - User creation data
   */
  async create(data) {
    return prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        companyId: true,
        permissions: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  /**
   * Update a user by ID.
   * @param {string} id
   * @param {object} data - Fields to update
   */
  async update(id, data) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        companyId: true,
        permissions: true,
        isActive: true,
        lastLoginAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Soft-delete: deactivate a user.
   * @param {string} id
   */
  async delete(id) {
    return prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }

  /**
   * Find all users belonging to a company (paginated).
   * @param {string} companyId
   * @param {object} options - { skip, limit, role, isActive }
   */
  async findByCompany(companyId, { skip = 0, limit = 50, role, isActive } = {}) {
    const where = { companyId };
    if (role) where.role = role;
    if (isActive !== undefined) where.isActive = isActive;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          permissions: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    return { users, total };
  }

  /**
   * Update last login timestamp.
   * @param {string} id
   */
  async updateLastLogin(id) {
    return prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
    });
  }

  /**
   * Count users by company.
   * @param {string} companyId
   */
  async countByCompany(companyId) {
    return prisma.user.count({ where: { companyId, isActive: true } });
  }
}

module.exports = new UserRepository();
