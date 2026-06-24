/**
 * Company Routes
 * Company profile and service management endpoints.
 *
 * @module routes/company
 */

const { Router } = require('express');
const companyController = require('../controllers/company.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/authorize.middleware');
const { validateBody } = require('../middleware/validation.middleware');
const {
  updateCompanySchema,
  createServiceSchema,
  updateServiceSchema,
} = require('../schemas/company.schema');
const { ROLES } = require('../utils/constants');

const router = Router();

// All company routes require authentication
router.use(authenticate);

// Company profile
router.get(
  '/profile',
  companyController.getProfile.bind(companyController)
);

router.patch(
  '/profile',
  authorizeRoles(ROLES.ADMIN, ROLES.MANAGER),
  validateBody(updateCompanySchema),
  companyController.updateProfile.bind(companyController)
);

// Services
router.get(
  '/services',
  companyController.getServices.bind(companyController)
);

router.post(
  '/services',
  authorizeRoles(ROLES.ADMIN, ROLES.MANAGER),
  validateBody(createServiceSchema),
  companyController.createService.bind(companyController)
);

router.patch(
  '/services/:id',
  authorizeRoles(ROLES.ADMIN, ROLES.MANAGER),
  validateBody(updateServiceSchema),
  companyController.updateService.bind(companyController)
);

router.delete(
  '/services/:id',
  authorizeRoles(ROLES.ADMIN),
  companyController.deleteService.bind(companyController)
);

module.exports = router;
