const leadService = require('../services/lead.service');
const { catchAsync } = require('../utils/catch-async');
const { createLeadSchema, updateLeadSchema } = require('../schemas/lead.schema');

const getLeads = catchAsync(async (req, res) => {
  const companyId = req.companyId;
  const filter = {};
  if (req.query.stage) filter.stage = req.query.stage;
  if (req.query.assignedToId) filter.assignedToId = req.query.assignedToId;

  const skip = req.query.skip !== undefined ? parseInt(req.query.skip, 10) : undefined;
  const limit = req.query.limit !== undefined ? parseInt(req.query.limit, 10) : undefined;

  const { leads, total } = await leadService.getLeads(companyId, {
    ...filter,
    ...(skip !== undefined && { skip }),
    ...(limit !== undefined && { limit }),
  });

  res.json({
    status: 'success',
    data: {
      leads,
      ...(skip !== undefined && limit !== undefined && {
        pagination: {
          total,
          skip,
          limit,
          pages: Math.ceil(total / limit),
          hasMore: skip + limit < total,
        }
      })
    }
  });
});

const getLead = catchAsync(async (req, res) => {
  const lead = await leadService.getLeadById(req.params.id, req.companyId);
  res.json({ status: 'success', data: { lead } });
});

const createLead = catchAsync(async (req, res) => {
  const validatedData = createLeadSchema.parse(req.body);
  const lead = await leadService.createLead(validatedData, req.userId, req.companyId);
  res.status(201).json({ status: 'success', data: { lead } });
});

const updateLead = catchAsync(async (req, res) => {
  const validatedData = updateLeadSchema.parse(req.body);
  const lead = await leadService.updateLead(req.params.id, validatedData, req.companyId);
  res.json({ status: 'success', data: { lead } });
});

const deleteLead = catchAsync(async (req, res) => {
  await leadService.deleteLead(req.params.id, req.companyId);
  res.status(204).send();
});

module.exports = {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
};
