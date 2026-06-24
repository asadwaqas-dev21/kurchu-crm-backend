const { z } = require('zod');

const updateNotificationSettingsSchema = z.object({
  emailLeads: z.boolean().optional(),
  emailBookings: z.boolean().optional(),
  emailSystem: z.boolean().optional(),
  pushLeads: z.boolean().optional(),
  pushBookings: z.boolean().optional(),
  pushSystem: z.boolean().optional(),
  smsLeads: z.boolean().optional(),
  smsBookings: z.boolean().optional(),
});

module.exports = {
  updateNotificationSettingsSchema,
};
