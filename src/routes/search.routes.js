const { Router } = require('express');
const searchController = require('../controllers/search.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = Router();

router.use(authenticate);

router.get('/', searchController.globalSearch);

module.exports = router;
