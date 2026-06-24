const { z } = require('zod');

const createDocumentSchema = z.object({
  name: z.string().min(1, 'Document name is required'),
  size: z.string().min(1, 'Document size is required'),
  url: z.string().url('Invalid document URL'),
  type: z.string().min(1, 'Document type is required'),
});

const updateDocumentSchema = z.object({
  name: z.string().min(1).optional(),
  size: z.string().min(1).optional(),
  url: z.string().url().optional(),
  type: z.string().min(1).optional(),
});

module.exports = {
  createDocumentSchema,
  updateDocumentSchema,
};
