const { z } = require('zod');

const createFollowUpSchema = z.object({
  leadId: z.string().min(1, 'Lead ID is required'),
  scheduledAt: z.string().datetime({ message: 'Invalid datetime' }),
  callNotes: z.string().optional(),
});

const updateFollowUpSchema = z.object({
  scheduledAt: z.string().datetime().optional(),
  callNotes: z.string().optional(),
  isCompleted: z.boolean().optional(),
});

module.exports = {
  createFollowUpSchema,
  updateFollowUpSchema,
};
