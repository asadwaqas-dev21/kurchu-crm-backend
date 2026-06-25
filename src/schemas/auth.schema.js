/**
 * Auth Validation Schemas
 * Zod schemas for all authentication endpoints.
 *
 * @module schemas/auth
 */

const { z } = require('zod');

const registerSchema = z.object({
  email: z.string().email('Invalid email format').toLowerCase().trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/, 'Password must contain at least one special character'),
  firstName: z.string().min(2, 'First name must be at least 2 characters').trim(),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').trim(),
  phone: z
    .string()
    .regex(/^\+?[0-9\-\s()]+$/, 'Invalid phone number format')
    .optional(),
  companyName: z.string().min(2, 'Company name must be at least 2 characters').trim(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
});

const updateProfileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').trim().optional(),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').trim().optional(),
  phone: z
    .preprocess((val) => (val === '' ? null : val), z
      .string()
      .regex(/^\+?[0-9\-\s()]+$/, 'Invalid phone number format')
      .optional()
      .nullable()),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email format').toLowerCase().trim(),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/, 'Password must contain at least one special character'),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
};
