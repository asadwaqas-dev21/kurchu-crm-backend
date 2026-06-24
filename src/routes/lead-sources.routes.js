/**
 * Lead Sources Routes
 * Lead source management endpoints.
 *
 * @module routes/lead-sources
 */

const { Router } = require('express');
const leadSourcesController = require('../controllers/lead-sources.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/authorize.middleware');
const { validateBody } = require('../middleware/validation.middleware');
const {
  createLeadSourceSchema,
  updateLeadSourceSchema,
} = require('../schemas/lead-source.schema');
const { ROLES } = require('../utils/constants');

const router = Router();

// All lead source routes require authentication
router.use(authenticate);

router.get(
  '/',
  leadSourcesController.getAll.bind(leadSourcesController)
);

router.post(
  '/',
  authorizeRoles(ROLES.ADMIN, ROLES.MANAGER),
  validateBody(createLeadSourceSchema),
  leadSourcesController.create.bind(leadSourcesController)
);

router.patch(
  '/:id',
  authorizeRoles(ROLES.ADMIN, ROLES.MANAGER),
  validateBody(updateLeadSourceSchema),
  leadSourcesController.update.bind(leadSourcesController)
);

router.delete(
  '/:id',
  authorizeRoles(ROLES.ADMIN),
  leadSourcesController.delete.bind(leadSourcesController)
);

module.exports = router;
