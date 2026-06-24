const { z } = require('zod');

const createLeadSchema = z.object({
  firstName: z.string().min(2, 'First name is required').trim(),
  lastName: z.string().min(2, 'Last name is required').trim(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  company: z.string().optional().or(z.literal('')),
  sourceId: z.string().min(1, 'Source is required'),
  assignedToId: z.string().min(1, 'Assignee is required'),
  stage: z.string().default('NEW'),
});

const updateLeadSchema = z.object({
  firstName: z.string().min(2).trim().optional(),
  lastName: z.string().min(2).trim().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  company: z.string().optional().or(z.literal('')),
  sourceId: z.string().optional(),
  assignedToId: z.string().optional(),
  stage: z.string().optional(),
});

module.exports = {
  createLeadSchema,
  updateLeadSchema,
};
