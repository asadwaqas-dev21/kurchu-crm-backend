/**
 * Dashboard Service
 * Business logic for dashboard metrics, alerts, stats, and chart data.
 *
 * @module services/dashboard
 */

const { prisma } = require('../config/database');
const leadRepository = require('../repositories/lead.repository');
const bookingRepository = require('../repositories/booking.repository');
const paymentRepository = require('../repositories/payment.repository');
const alertRepository = require('../repositories/alert.repository');
const followUpRepository = require('../repositories/follow-up.repository');

class DashboardService {
  /**
   * Get all KPI metrics for the dashboard.
   * @param {string} companyId
   */
  async getMetrics(companyId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      totalLeads,
      newLeadsToday,
      callsToday,
      bookingsThisMonth,
      bookings,
      totalRevenue,
      invoices,
    ] = await Promise.all([
      leadRepository.countByCompany(companyId),
      leadRepository.countByDateRange(companyId, today),
      followUpRepository.countCompletedByDate(companyId, today),
      bookingRepository.countByDateRange(companyId, monthStart),
      bookingRepository.findByCompany(companyId),
      paymentRepository.sumByCompany(companyId),
      prisma.invoice.findMany({
        where: {
          booking: {
            companyId,
          },
        },
      }),
    ]);

    const pendingPayments = bookings.reduce(
      (sum, b) => sum + (b.pendingAmount || 0),
      0
    );

    const invoicedAmount = invoices.reduce(
      (sum, inv) => sum + (inv.amount || 0),
      0
    );

    const totalProfit = totalRevenue * 0.325; // 32.5% profit margin estimation

    const totalBookings = bookings.length;
    const conversionRate = totalLeads > 0
      ? ((totalBookings / totalLeads) * 100).toFixed(1)
      : '0.0';

    const averageDealValue = totalBookings > 0
      ? (totalRevenue / totalBookings).toFixed(2)
      : '0.00';

    return {
      totalLeads,
      newLeadsToday,
      callsToday,
      bookingsThisMonth,
      pendingPayments,
      totalRevenue,
      collectedAmount: totalRevenue,
      invoicedAmount,
      totalProfit,
      conversionRate: conversionRate,
      averageDealValue: averageDealValue,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get alerts for the dashboard (paginated).
   * @param {string} companyId
   * @param {number} skip
   * @param {number} limit
   */
  async getAlerts(companyId, skip = 0, limit = 10) {
    return alertRepository.findByCompany(companyId, skip, limit);
  }

  /**
   * Get today's activity statistics.
   * @param {string} companyId
   */
  async getTodayStats(companyId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const now = new Date();

    // Get today's follow-ups
    const followUps = await followUpRepository.findByDateRange(companyId, today);

    const completedFollowUps = followUps.filter((f) => f.isCompleted).length;
    const missedFollowUps = followUps.filter(
      (f) => !f.isCompleted && new Date(f.scheduledAt) < now
    ).length;
    const upcomingFollowUps = followUps.filter(
      (f) => !f.isCompleted && new Date(f.scheduledAt) >= now
    ).length;

    // Get today's booking counts
    const [newBookings, confirmedBookings] = await Promise.all([
      bookingRepository.countByStatus(companyId, 'PENDING', today),
      bookingRepository.countByStatus(companyId, 'CONFIRMED', today),
    ]);

    return {
      calls: {
        total: followUps.length,
        completed: completedFollowUps,
        pending: followUps.length - completedFollowUps,
      },
      followUps: {
        completed: completedFollowUps,
        missed: missedFollowUps,
        upcoming: upcomingFollowUps,
      },
      meetings: {
        scheduled: 0,
        completed: 0,
      },
      bookings: {
        new: newBookings,
        confirmed: confirmedBookings,
      },
    };
  }

  /**
   * Get chart data for revenue/leads trends.
   * @param {string} companyId
   * @param {string} type - 'revenue' | 'leads' | 'bookings' | 'conversions'
   * @param {string} period - 'week' | 'month' | 'quarter' | 'year'
   */
  async getChartData(companyId, type = 'revenue', period = 'month') {
    const { from, to, labels, intervals } = this._getDateRange(period);

    if (type === 'revenue') {
      return this._getRevenueChartData(companyId, labels, intervals);
    }

    if (type === 'leads') {
      return this._getLeadsChartData(companyId, labels, intervals);
    }

    if (type === 'bookings') {
      return this._getBookingsChartData(companyId, labels, intervals);
    }

    // Default: revenue
    return this._getRevenueChartData(companyId, labels, intervals);
  }

  /**
   * Generate revenue chart data.
   */
  async _getRevenueChartData(companyId, labels, intervals) {
    const data = [];

    for (const interval of intervals) {
      const payments = await paymentRepository.findByDateRange(
        companyId,
        interval.from,
        interval.to
      );
      data.push(payments.reduce((sum, p) => sum + p.amount, 0));
    }

    return {
      labels,
      datasets: [
        {
          label: 'Revenue',
          data,
          color: '#01a5de',
        },
      ],
    };
  }

  /**
   * Generate leads chart data.
   */
  async _getLeadsChartData(companyId, labels, intervals) {
    const data = [];

    for (const interval of intervals) {
      const count = await leadRepository.countByDateRange(
        companyId,
        interval.from,
        interval.to
      );
      data.push(count);
    }

    return {
      labels,
      datasets: [
        {
          label: 'New Leads',
          data,
          color: '#10b981',
        },
      ],
    };
  }

  /**
   * Generate bookings chart data.
   */
  async _getBookingsChartData(companyId, labels, intervals) {
    const data = [];

    for (const interval of intervals) {
      const count = await bookingRepository.countByDateRange(
        companyId,
        interval.from,
        interval.to
      );
      data.push(count);
    }

    return {
      labels,
      datasets: [
        {
          label: 'Bookings',
          data,
          color: '#f59e0b',
        },
      ],
    };
  }

  /**
   * Calculate date ranges and labels based on period.
   * @param {string} period
   */
  _getDateRange(period) {
    const now = new Date();
    const labels = [];
    const intervals = [];

    if (period === 'week') {
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const from = new Date(date.setHours(0, 0, 0, 0));
        const to = new Date(date.setHours(23, 59, 59, 999));

        labels.push(from.toLocaleDateString('en', { weekday: 'short' }));
        intervals.push({ from: new Date(from), to: new Date(to) });
      }
    } else if (period === 'month') {
      for (let i = 3; i >= 0; i--) {
        const weekEnd = new Date(now);
        weekEnd.setDate(weekEnd.getDate() - i * 7);
        const weekStart = new Date(weekEnd);
        weekStart.setDate(weekStart.getDate() - 6);

        labels.push(`Week ${4 - i}`);
        intervals.push({
          from: new Date(weekStart.setHours(0, 0, 0, 0)),
          to: new Date(weekEnd.setHours(23, 59, 59, 999)),
        });
      }
    } else if (period === 'quarter') {
      for (let i = 2; i >= 0; i--) {
        const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
        const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);

        labels.push(monthStart.toLocaleDateString('en', { month: 'short' }));
        intervals.push({
          from: monthStart,
          to: new Date(monthEnd.setHours(23, 59, 59, 999)),
        });
      }
    } else {
      // year — 12 months
      for (let i = 11; i >= 0; i--) {
        const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
        const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);

        labels.push(monthStart.toLocaleDateString('en', { month: 'short' }));
        intervals.push({
          from: monthStart,
          to: new Date(monthEnd.setHours(23, 59, 59, 999)),
        });
      }
    }

    return {
      from: intervals[0]?.from,
      to: intervals[intervals.length - 1]?.to,
      labels,
      intervals,
    };
  }
}

module.exports = new DashboardService();
