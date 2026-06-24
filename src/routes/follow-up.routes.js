const { Router } = require('express');
const followUpController = require('../controllers/follow-up.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = Router();

router.use(authenticate);

router
  .route('/')
  .get(followUpController.getFollowUps)
  .post(followUpController.createFollowUp);

router
  .route('/:id')
  .get(followUpController.getFollowUp)
  .put(followUpController.updateFollowUp)
  .delete(followUpController.deleteFollowUp);

module.exports = router;
