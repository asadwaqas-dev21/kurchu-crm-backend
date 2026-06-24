const bookingService = require('../services/booking.service');
const { catchAsync } = require('../utils/catch-async');
const { createBookingSchema, updateBookingSchema } = require('../schemas/booking.schema');

const getBookings = catchAsync(async (req, res) => {
  const companyId = req.companyId;
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.leadId) filter.leadId = req.query.leadId;

  const bookings = await bookingService.getBookings(companyId, filter);
  res.json({ status: 'success', data: { bookings } });
});

const getBooking = catchAsync(async (req, res) => {
  const booking = await bookingService.getBookingById(req.params.id, req.companyId);
  res.json({ status: 'success', data: { booking } });
});

const createBooking = catchAsync(async (req, res) => {
  const validatedData = createBookingSchema.parse(req.body);
  const booking = await bookingService.createBooking(validatedData, req.companyId);
  res.status(201).json({ status: 'success', data: { booking } });
});

const updateBooking = catchAsync(async (req, res) => {
  const validatedData = updateBookingSchema.parse(req.body);
  const booking = await bookingService.updateBooking(req.params.id, validatedData, req.companyId);
  res.json({ status: 'success', data: { booking } });
});

const deleteBooking = catchAsync(async (req, res) => {
  await bookingService.deleteBooking(req.params.id, req.companyId);
  res.status(204).send();
});

module.exports = {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
};
