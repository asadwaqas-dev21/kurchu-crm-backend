const { Router } = require('express');
const itineraryController = require('../controllers/itinerary.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = Router();

router.use(authenticate);

router
  .route('/')
  .get(itineraryController.getItineraries)
  .post(itineraryController.createItinerary);

router
  .route('/:id')
  .get(itineraryController.getItinerary)
  .put(itineraryController.updateItinerary)
  .delete(itineraryController.deleteItinerary);

module.exports = router;
