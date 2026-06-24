const { z } = require('zod');

const createItinerarySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().nullable(),
  startDate: z.string().transform((str) => new Date(str)),
  endDate: z.string().transform((str) => new Date(str)),
  leadId: z.string().min(1, 'Lead ID is required'),
  bookingId: z.string().optional().nullable(),
});

const updateItinerarySchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  startDate: z.string().transform((str) => new Date(str)).optional(),
  endDate: z.string().transform((str) => new Date(str)).optional(),
  bookingId: z.string().optional().nullable(),
});

module.exports = {
  createItinerarySchema,
  updateItinerarySchema,
};
