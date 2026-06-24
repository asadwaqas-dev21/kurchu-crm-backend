/**
 * Dashboard Validation Schemas
 * Zod schemas for dashboard query endpoints.
 *
 * @module schemas/dashboard
 */

const { z } = require('zod');

const alertsQuerySchema = z.object({
  limit: z.string().transform(Number).default('10').optional(),
  skip: z.string().transform(Number).default('0').optional(),
});

const chartDataQuerySchema = z.object({
  type: z.enum(['revenue', 'leads', 'bookings', 'conversions']).default('revenue'),
  period: z.enum(['week', 'month', 'quarter', 'year']).default('month'),
});

module.exports = {
  alertsQuerySchema,
  chartDataQuerySchema,
};
