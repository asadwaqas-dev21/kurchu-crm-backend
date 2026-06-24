const { z } = require('zod');

const createBookingSchema = z.object({
  leadId: z.string().min(1, 'Lead ID is required'),
  serviceId: z.string().min(1, 'Service ID is required'),
  bookingDate: z.string().transform((str) => new Date(str)),
  amount: z.number().min(0, 'Amount must be a positive number'),
  collectedAmount: z.number().min(0).default(0),
});

const updateBookingSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']).optional(),
  bookingDate: z.string().transform((str) => new Date(str)).optional(),
  completionDate: z.string().transform((str) => new Date(str)).optional().nullable(),
  collectedAmount: z.number().min(0).optional(),
});

module.exports = {
  createBookingSchema,
  updateBookingSchema,
};
