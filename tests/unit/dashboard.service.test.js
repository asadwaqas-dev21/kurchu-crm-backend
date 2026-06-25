/**
 * Dashboard Service — Unit Tests
 */

jest.mock('../../src/repositories/lead.repository');
jest.mock('../../src/repositories/booking.repository');
jest.mock('../../src/repositories/payment.repository');
jest.mock('../../src/repositories/alert.repository');
jest.mock('../../src/repositories/follow-up.repository');

const dashboardService = require('../../src/services/dashboard.service');
const leadRepository = require('../../src/repositories/lead.repository');
const bookingRepository = require('../../src/repositories/booking.repository');
const paymentRepository = require('../../src/repositories/payment.repository');
const alertRepository = require('../../src/repositories/alert.repository');
const followUpRepository = require('../../src/repositories/follow-up.repository');
const { mockCompany, mockAlert } = require('../fixtures/test-data');

const companyId = mockCompany.id;

describe('DashboardService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── getMetrics ────────────────────────────

  describe('getMetrics', () => {
    it('should return all KPI metrics', async () => {
      leadRepository.countByCompany.mockResolvedValue(100);
      leadRepository.countByDateRange.mockResolvedValue(5);
      followUpRepository.countCompletedByDate.mockResolvedValue(12);
      bookingRepository.countByDateRange.mockResolvedValue(8);
      bookingRepository.findByCompany.mockResolvedValue([
        { id: '1', amount: 5000, pendingAmount: 2000 },
        { id: '2', amount: 3000, pendingAmount: 0 },
      ]);
      paymentRepository.sumByCompany.mockResolvedValue(6000);

      const metrics = await dashboardService.getMetrics(companyId);

      expect(metrics).toHaveProperty('totalLeads', 100);
      expect(metrics).toHaveProperty('newLeadsToday', 5);
      expect(metrics).toHaveProperty('callsToday', 12);
      expect(metrics).toHaveProperty('bookingsThisMonth', 8);
      expect(metrics).toHaveProperty('pendingPayments', 2000);
      expect(metrics).toHaveProperty('totalRevenue', 6000);
      expect(metrics).toHaveProperty('conversionRate');
      expect(metrics).toHaveProperty('averageDealValue');
      expect(metrics).toHaveProperty('timestamp');
    });

    it('should handle zero leads without division errors', async () => {
      leadRepository.countByCompany.mockResolvedValue(0);
      leadRepository.countByDateRange.mockResolvedValue(0);
      followUpRepository.countCompletedByDate.mockResolvedValue(0);
      bookingRepository.countByDateRange.mockResolvedValue(0);
      bookingRepository.findByCompany.mockResolvedValue([]);
      paymentRepository.sumByCompany.mockResolvedValue(0);

      const metrics = await dashboardService.getMetrics(companyId);

      expect(metrics.conversionRate).toBe('0.0');
      expect(metrics.averageDealValue).toBe('0.00');
    });
  });

  // ─── getAlerts ─────────────────────────────

  describe('getAlerts', () => {
    it('should return paginated alerts with unread count', async () => {
      alertRepository.findByCompany.mockResolvedValue({
        alerts: [mockAlert],
        total: 1,
        unread: 1,
      });

      const result = await dashboardService.getAlerts(companyId, 0, 10);

      expect(result).toHaveProperty('alerts');
      expect(result).toHaveProperty('total', 1);
      expect(result).toHaveProperty('unread', 1);
      expect(alertRepository.findByCompany).toHaveBeenCalledWith(companyId, 0, 10);
    });
  });

  // ─── getTodayStats ─────────────────────────

  describe('getTodayStats', () => {
    it('should return structured today stats', async () => {
      const now = new Date();
      followUpRepository.findByDateRange.mockResolvedValue([
        { id: '1', scheduledAt: new Date(now.getTime() - 60000), isCompleted: true },
        { id: '2', scheduledAt: new Date(now.getTime() - 60000), isCompleted: false },
        { id: '3', scheduledAt: new Date(now.getTime() + 3600000), isCompleted: false },
      ]);
      bookingRepository.countByStatus.mockResolvedValue(1);

      const stats = await dashboardService.getTodayStats(companyId);

      expect(stats).toHaveProperty('calls');
      expect(stats.calls).toHaveProperty('total', 3);
      expect(stats.calls).toHaveProperty('completed', 1);
      expect(stats).toHaveProperty('followUps');
      expect(stats.followUps).toHaveProperty('completed', 1);
      expect(stats.followUps).toHaveProperty('missed', 1);
      expect(stats.followUps).toHaveProperty('upcoming', 1);
      expect(stats).toHaveProperty('bookings');
    });
  });

  // ─── getChartData ──────────────────────────

  describe('getChartData', () => {
    it('should return revenue chart data for month period', async () => {
      paymentRepository.findByDateRange.mockResolvedValue([
        { id: '1', amount: 5000, paidAt: new Date() },
      ]);

      const chart = await dashboardService.getChartData(companyId, 'revenue', 'month');

      expect(chart).toHaveProperty('labels');
      expect(chart.labels).toHaveLength(4);
      expect(chart).toHaveProperty('datasets');
      expect(chart.datasets[0]).toHaveProperty('label', 'Revenue');
      expect(chart.datasets[0]).toHaveProperty('data');
      expect(chart.datasets[0]).toHaveProperty('color', '#01a5de');
    });

    it('should return leads chart data', async () => {
      leadRepository.countByDateRange.mockResolvedValue(10);

      const chart = await dashboardService.getChartData(companyId, 'leads', 'week');

      expect(chart.labels).toHaveLength(7);
      expect(chart.datasets[0].label).toBe('New Leads');
    });
  });
});
