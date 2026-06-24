/**
 * Lead Source Validation Schemas
 * Zod schemas for lead source management endpoints.
 *
 * @module schemas/lead-source
 */

const { z } = require('zod');

const createLeadSourceSchema = z.object({
  name: z.string().min(1, 'Lead source name is required').trim(),
});

const updateLeadSourceSchema = z.object({
  name: z.string().min(1, 'Lead source name is required').trim(),
});

module.exports = {
  createLeadSourceSchema,
  updateLeadSourceSchema,
};
