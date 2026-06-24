/**
 * Dashboard Controller
 * Handles dashboard metrics, alerts, stats, and chart data requests.
 *
 * @module controllers/dashboard
 */

const dashboardService = require('../services/dashboard.service');
const { successResponse } = require('../utils/formatters');

class DashboardController {
  /**
   * GET /api/dashboard/metrics
   */
  async getMetrics(req, res) {
    const metrics = await dashboardService.getMetrics(req.companyId);

    res.status(200).json(
      successResponse(metrics, 'Dashboard metrics retrieved')
    );
  }

  /**
   * GET /api/dashboard/alerts
   */
  async getAlerts(req, res) {
    const { skip = 0, limit = 10 } = req.validatedQuery || req.query;

    const result = await dashboardService.getAlerts(
      req.companyId,
      parseInt(skip, 10),
      parseInt(limit, 10)
    );

    res.status(200).json(
      successResponse(result, 'Alerts retrieved')
    );
  }

  /**
   * GET /api/dashboard/today-stats
   */
  async getTodayStats(req, res) {
    const stats = await dashboardService.getTodayStats(req.companyId);

    res.status(200).json(
      successResponse(stats, 'Today stats retrieved')
    );
  }

  /**
   * GET /api/dashboard/chart-data
   */
  async getChartData(req, res) {
    const { type = 'revenue', period = 'month' } = req.validatedQuery || req.query;

    const chartData = await dashboardService.getChartData(
      req.companyId,
      type,
      period
    );

    res.status(200).json(
      successResponse(chartData, 'Chart data retrieved')
    );
  }
}

module.exports = new DashboardController();
