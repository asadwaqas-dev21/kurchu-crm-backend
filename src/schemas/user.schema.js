/**
 * User Validation Schemas
 * Zod schemas for user management endpoints.
 *
 * @module schemas/user
 */

const { z } = require('zod');
const { ROLES, PERMISSIONS } = require('../utils/constants');

const roleEnum = z.enum(Object.values(ROLES));

const createUserSchema = z.object({
  email: z.string().email('Invalid email format').toLowerCase().trim(),
  firstName: z.string().min(2, 'First name must be at least 2 characters').trim(),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').trim(),
  phone: z
    .string()
    .regex(/^\+?[0-9\-\s()]+$/, 'Invalid phone number format')
    .optional()
    .nullable(),
  role: roleEnum.default('SALES_AGENT'),
});

const updateUserSchema = z.object({
  firstName: z.string().min(2).trim().optional(),
  lastName: z.string().min(2).trim().optional(),
  phone: z
    .string()
    .regex(/^\+?[0-9\-\s()]+$/)
    .optional()
    .nullable(),
  role: roleEnum.optional(),
  isActive: z.boolean().optional(),
});

const updatePermissionsSchema = z.object({
  permissions: z.array(
    z.enum(Object.values(PERMISSIONS))
  ),
});

const queryUsersSchema = z.object({
  role: roleEnum.optional(),
  skip: z.string().transform(Number).default('0').optional(),
  limit: z.string().transform(Number).default('50').optional(),
  isActive: z.string().transform((v) => v === 'true').optional(),
});

module.exports = {
  createUserSchema,
  updateUserSchema,
  updatePermissionsSchema,
  queryUsersSchema,
};
