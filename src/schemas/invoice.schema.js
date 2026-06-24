const { z } = require('zod');

const createInvoiceSchema = z.object({
  bookingId: z.string().min(1, 'Booking ID is required'),
  status: z.enum(['DRAFT', 'SENT', 'PAID', 'OVERDUE']).default('DRAFT'),
  amount: z.number().min(0, 'Amount must be a positive number'),
  dueDate: z.string().transform((str) => new Date(str)),
  pdfUrl: z.string().url().optional().nullable(),
});

const updateInvoiceSchema = z.object({
  status: z.enum(['DRAFT', 'SENT', 'PAID', 'OVERDUE']).optional(),
  amount: z.number().min(0).optional(),
  dueDate: z.string().transform((str) => new Date(str)).optional(),
  pdfUrl: z.string().url().optional().nullable(),
});

module.exports = {
  createInvoiceSchema,
  updateInvoiceSchema,
};
