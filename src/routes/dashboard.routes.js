/**
 * Dashboard Routes
 * All dashboard-related endpoints.
 *
 * @module routes/dashboard
 */

const { Router } = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validateQuery } = require('../middleware/validation.middleware');
const { alertsQuerySchema, chartDataQuerySchema } = require('../schemas/dashboard.schema');

const router = Router();

// All dashboard routes require authentication
router.use(authenticate);

router.get(
  '/metrics',
  dashboardController.getMetrics.bind(dashboardController)
);

router.get(
  '/alerts',
  validateQuery(alertsQuerySchema),
  dashboardController.getAlerts.bind(dashboardController)
);

router.get(
  '/today-stats',
  dashboardController.getTodayStats.bind(dashboardController)
);

router.get(
  '/chart-data',
  validateQuery(chartDataQuerySchema),
  dashboardController.getChartData.bind(dashboardController)
);

module.exports = router;
