/**
 * Dashboard Routes — Integration Tests
 */

jest.mock('../../src/config/database', () => ({
  prisma: {
    user: { findUnique: jest.fn() },
    lead: { count: jest.fn(), groupBy: jest.fn(), findMany: jest.fn() },
    followUp: { count: jest.fn(), findMany: jest.fn() },
    booking: { count: jest.fn(), findMany: jest.fn() },
    payment: { aggregate: jest.fn(), findMany: jest.fn() },
    alert: { findMany: jest.fn(), count: jest.fn() },
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  },
  connectDatabase: jest.fn(),
  disconnectDatabase: jest.fn(),
}));

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../src/app');
const { prisma } = require('../../src/config/database');
const { mockAdminUser } = require('../fixtures/test-data');

// Generate a valid test token
const testToken = jwt.sign(
  { userId: mockAdminUser.id, type: 'access' },
  process.env.JWT_ACCESS_SECRET || 'test_access_secret_that_is_32_chars_long!!',
  { expiresIn: '15m' }
);

describe('Dashboard Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock user lookup for auth middleware
    prisma.user.findUnique.mockResolvedValue({
      id: mockAdminUser.id,
      email: mockAdminUser.email,
      role: mockAdminUser.role,
      companyId: mockAdminUser.companyId,
      isActive: true,
      permissions: mockAdminUser.permissions,
    });
  });

  // ─── GET /api/dashboard/metrics ──────────

  describe('GET /api/dashboard/metrics', () => {
    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/dashboard/metrics');
      expect(res.statusCode).toBe(401);
    });
  });

  // ─── GET /api/dashboard/alerts ───────────

  describe('GET /api/dashboard/alerts', () => {
    it('should return 401 without authentication', async () => {
      const res = await request(app).get('/api/dashboard/alerts');
      expect(res.statusCode).toBe(401);
    });
  });

  // ─── GET /api/dashboard/today-stats ──────

  describe('GET /api/dashboard/today-stats', () => {
    it('should return 401 without authentication', async () => {
      const res = await request(app).get('/api/dashboard/today-stats');
      expect(res.statusCode).toBe(401);
    });
  });
});
