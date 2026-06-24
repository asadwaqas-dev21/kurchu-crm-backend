const { Router } = require('express');
const bookingController = require('../controllers/booking.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = Router();

router.use(authenticate);

router
  .route('/')
  .get(bookingController.getBookings)
  .post(bookingController.createBooking);

router
  .route('/:id')
  .get(bookingController.getBooking)
  .put(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
