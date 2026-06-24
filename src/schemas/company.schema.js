/**
 * Company Validation Schemas
 * Zod schemas for company profile and service endpoints.
 *
 * @module schemas/company
 */

const { z } = require('zod');

const updateCompanySchema = z.object({
  name: z.string().min(2).trim().optional(),
  phone: z.string().regex(/^\+?[0-9\-\s()]+$/).optional().nullable(),
  website: z.string().url('Invalid website URL').optional().nullable(),
  address: z.string().trim().optional().nullable(),
  city: z.string().trim().optional().nullable(),
  state: z.string().trim().optional().nullable(),
  country: z.string().trim().optional().nullable(),
  zipCode: z.string().trim().optional().nullable(),
  currency: z.string().length(3, 'Currency must be a 3-letter code').toUpperCase().optional(),
  timezone: z.string().trim().optional(),
});

const createServiceSchema = z.object({
  name: z.string().min(1, 'Service name is required').trim(),
  description: z.string().trim().optional().nullable(),
  price: z.number().positive('Price must be a positive number'),
});

const updateServiceSchema = z.object({
  name: z.string().min(1, 'Service name is required').trim().optional(),
  description: z.string().trim().optional().nullable(),
  price: z.number().positive('Price must be a positive number').optional(),
});

module.exports = {
  updateCompanySchema,
  createServiceSchema,
  updateServiceSchema,
};
