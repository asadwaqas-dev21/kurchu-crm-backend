/**
 * Auth Routes — Integration Tests
 *
 * Note: These tests require a test database.
 * For CI, mock the database layer instead.
 */

jest.mock('../../src/config/database', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    company: {
      create: jest.fn(),
    },
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  },
  connectDatabase: jest.fn(),
  disconnectDatabase: jest.fn(),
}));

jest.mock('../../src/services/email.service', () => ({
  sendPasswordResetEmail: jest.fn(),
  sendWelcomeEmail: jest.fn(),
}));

const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../../src/app');
const { prisma } = require('../../src/config/database');
const { validRegistration, validLogin, mockCompany, mockAdminUser } = require('../fixtures/test-data');

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── POST /api/auth/register ─────────────

  describe('POST /api/auth/register', () => {
    it('should register a new user and return 201', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.company.create.mockResolvedValue(mockCompany);
      prisma.user.create.mockResolvedValue({
        id: 'new-user-id',
        email: validRegistration.email,
        firstName: validRegistration.firstName,
        lastName: validRegistration.lastName,
        role: 'ADMIN',
        companyId: mockCompany.id,
        permissions: [],
        isActive: true,
        createdAt: new Date(),
      });
      prisma.user.update.mockResolvedValue({});

      const res = await request(app)
        .post('/api/auth/register')
        .send(validRegistration);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('accessToken');
      expect(res.body.data).toHaveProperty('refreshToken');
      expect(res.body.data).toHaveProperty('user');
    });

    it('should return 400 for invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ ...validRegistration, email: 'invalid' });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 for weak password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ ...validRegistration, password: '123' });

      expect(res.statusCode).toBe(400);
    });
  });

  // ─── POST /api/auth/login ────────────────

  describe('POST /api/auth/login', () => {
    it('should login and return tokens', async () => {
      const hashedPassword = await bcrypt.hash(validLogin.password, 10);
      prisma.user.findUnique.mockResolvedValue({
        ...mockAdminUser,
        password: hashedPassword,
        isActive: true,
      });
      prisma.user.update.mockResolvedValue({});

      const res = await request(app)
        .post('/api/auth/login')
        .send(validLogin);

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveProperty('accessToken');
      expect(res.body.data).toHaveProperty('user');
      expect(res.body.data.user).not.toHaveProperty('password');
    });

    it('should return 401 for wrong password', async () => {
      prisma.user.findUnique.mockResolvedValue({
        ...mockAdminUser,
        password: await bcrypt.hash('DifferentPass!', 10),
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send(validLogin);

      expect(res.statusCode).toBe(401);
    });

    it('should return 400 for missing email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ password: 'test' });

      expect(res.statusCode).toBe(400);
    });
  });

  // ─── GET /api/auth/me ────────────────────

  describe('GET /api/auth/me', () => {
    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/auth/me');

      expect(res.statusCode).toBe(401);
    });
  });

  // ─── POST /api/auth/forgot-password ──────

  describe('POST /api/auth/forgot-password', () => {
    it('should return 200 even for non-existent email (security)', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'nonexistent@test.com' });

      expect(res.statusCode).toBe(200);
    });
  });

  // ─── 404 ─────────────────────────────────

  describe('Unknown routes', () => {
    it('should return 404 for unknown routes', async () => {
      const res = await request(app).get('/api/unknown');

      expect(res.statusCode).toBe(404);
    });
  });
});
