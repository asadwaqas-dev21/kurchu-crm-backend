/**
 * Users Routes
 * User management and permissions endpoints.
 *
 * @module routes/users
 */

const { Router } = require('express');
const usersController = require('../controllers/users.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/authorize.middleware');
const { validateBody, validateQuery } = require('../middleware/validation.middleware');
const {
  createUserSchema,
  updateUserSchema,
  updatePermissionsSchema,
  queryUsersSchema,
} = require('../schemas/user.schema');
const { ROLES } = require('../utils/constants');

const router = Router();

// All user routes require authentication
router.use(authenticate);

router.get(
  '/',
  authorizeRoles(ROLES.ADMIN, ROLES.MANAGER),
  validateQuery(queryUsersSchema),
  usersController.getAll.bind(usersController)
);

router.post(
  '/',
  authorizeRoles(ROLES.ADMIN),
  validateBody(createUserSchema),
  usersController.create.bind(usersController)
);

router.get(
  '/:id',
  authorizeRoles(ROLES.ADMIN, ROLES.MANAGER),
  usersController.getById.bind(usersController)
);

router.patch(
  '/:id',
  authorizeRoles(ROLES.ADMIN, ROLES.MANAGER),
  validateBody(updateUserSchema),
  usersController.update.bind(usersController)
);

router.delete(
  '/:id',
  authorizeRoles(ROLES.ADMIN),
  usersController.delete.bind(usersController)
);

router.patch(
  '/:id/permissions',
  authorizeRoles(ROLES.ADMIN),
  validateBody(updatePermissionsSchema),
  usersController.updatePermissions.bind(usersController)
);

module.exports = router;
