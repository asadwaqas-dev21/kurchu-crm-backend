/**
 * Company Routes — Integration Tests
 */

jest.mock('../../src/config/database', () => ({
  prisma: {
    user: { findUnique: jest.fn() },
    company: { findUnique: jest.fn(), update: jest.fn() },
    service: { findMany: jest.fn(), create: jest.fn(), findUnique: jest.fn(), update: jest.fn(), delete: jest.fn() },
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  },
  connectDatabase: jest.fn(),
  disconnectDatabase: jest.fn(),
}));

const request = require('supertest');
const app = require('../../src/app');

describe('Company Routes', () => {
  // ─── GET /api/company/profile ────────────

  describe('GET /api/company/profile', () => {
    it('should return 401 without authentication', async () => {
      const res = await request(app).get('/api/company/profile');
      expect(res.statusCode).toBe(401);
    });
  });

  // ─── PATCH /api/company/profile ──────────

  describe('PATCH /api/company/profile', () => {
    it('should return 401 without authentication', async () => {
      const res = await request(app)
        .patch('/api/company/profile')
        .send({ name: 'Updated' });

      expect(res.statusCode).toBe(401);
    });
  });

  // ─── GET /api/company/services ───────────

  describe('GET /api/company/services', () => {
    it('should return 401 without authentication', async () => {
      const res = await request(app).get('/api/company/services');
      expect(res.statusCode).toBe(401);
    });
  });
});
