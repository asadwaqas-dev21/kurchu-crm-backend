const followUpService = require('../services/follow-up.service');
const { catchAsync } = require('../utils/catch-async');
const { createFollowUpSchema, updateFollowUpSchema } = require('../schemas/follow-up.schema');

const getFollowUps = catchAsync(async (req, res) => {
  const companyId = req.companyId;
  const filter = {};
  if (req.query.isCompleted) {
    filter.isCompleted = req.query.isCompleted === 'true';
  }

  const followUps = await followUpService.getFollowUps(companyId, filter);
  res.json({ status: 'success', data: { followUps } });
});

const getFollowUp = catchAsync(async (req, res) => {
  const followUp = await followUpService.getFollowUpById(req.params.id, req.companyId);
  res.json({ status: 'success', data: { followUp } });
});

const createFollowUp = catchAsync(async (req, res) => {
  const validatedData = createFollowUpSchema.parse(req.body);
  const followUp = await followUpService.createFollowUp(validatedData, req.companyId);
  res.status(201).json({ status: 'success', data: { followUp } });
});

const updateFollowUp = catchAsync(async (req, res) => {
  const validatedData = updateFollowUpSchema.parse(req.body);
  const followUp = await followUpService.updateFollowUp(req.params.id, validatedData, req.companyId);
  res.json({ status: 'success', data: { followUp } });
});

const deleteFollowUp = catchAsync(async (req, res) => {
  await followUpService.deleteFollowUp(req.params.id, req.companyId);
  res.status(204).send();
});

module.exports = {
  getFollowUps,
  getFollowUp,
  createFollowUp,
  updateFollowUp,
  deleteFollowUp,
};
