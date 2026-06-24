const { Router } = require('express');
const leadController = require('../controllers/lead.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = Router();

router.use(authenticate);

router
  .route('/')
  .get(leadController.getLeads)
  .post(leadController.createLead);

router
  .route('/:id')
  .get(leadController.getLead)
  .put(leadController.updateLead)
  .delete(leadController.deleteLead);

module.exports = router;
