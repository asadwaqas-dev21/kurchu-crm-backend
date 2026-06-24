const itineraryService = require('../services/itinerary.service');
const { catchAsync } = require('../utils/catch-async');
const { createItinerarySchema, updateItinerarySchema } = require('../schemas/itinerary.schema');

const getItineraries = catchAsync(async (req, res) => {
  const companyId = req.companyId;
  const filter = {};
  if (req.query.leadId) filter.leadId = req.query.leadId;
  if (req.query.bookingId) filter.bookingId = req.query.bookingId;

  const itineraries = await itineraryService.getItineraries(companyId, filter);
  res.json({ status: 'success', data: { itineraries } });
});

const getItinerary = catchAsync(async (req, res) => {
  const itinerary = await itineraryService.getItineraryById(req.params.id, req.companyId);
  res.json({ status: 'success', data: { itinerary } });
});

const createItinerary = catchAsync(async (req, res) => {
  const validatedData = createItinerarySchema.parse(req.body);
  const itinerary = await itineraryService.createItinerary(validatedData, req.companyId);
  res.status(201).json({ status: 'success', data: { itinerary } });
});

const updateItinerary = catchAsync(async (req, res) => {
  const validatedData = updateItinerarySchema.parse(req.body);
  const itinerary = await itineraryService.updateItinerary(req.params.id, validatedData, req.companyId);
  res.json({ status: 'success', data: { itinerary } });
});

const deleteItinerary = catchAsync(async (req, res) => {
  await itineraryService.deleteItinerary(req.params.id, req.companyId);
  res.status(204).send();
});

module.exports = {
  getItineraries,
  getItinerary,
  createItinerary,
  updateItinerary,
  deleteItinerary,
};
