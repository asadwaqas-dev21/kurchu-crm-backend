/**
 * Auth Service — Unit Tests
 */

const bcrypt = require('bcryptjs');

// Mock dependencies before requiring the service
jest.mock('../../src/repositories/user.repository');
jest.mock('../../src/repositories/company.repository');
jest.mock('../../src/services/jwt.service');
jest.mock('../../src/services/email.service');

const authService = require('../../src/services/auth.service');
const userRepository = require('../../src/repositories/user.repository');
const companyRepository = require('../../src/repositories/company.repository');
const jwtService = require('../../src/services/jwt.service');
const {
  mockAdminUser,
  mockCompany,
  validRegistration,
  validLogin,
  mockTokens,
} = require('../fixtures/test-data');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── Register ──────────────────────────────

  describe('register', () => {
    it('should register a new user and return tokens', async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      companyRepository.create.mockResolvedValue(mockCompany);
      userRepository.create.mockResolvedValue({
        ...mockAdminUser,
        email: validRegistration.email,
      });
      jwtService.generateTokenPair.mockReturnValue(mockTokens);
      userRepository.updateLastLogin.mockResolvedValue(true);

      const result = await authService.register(validRegistration);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(userRepository.findByEmail).toHaveBeenCalledWith(validRegistration.email);
      expect(companyRepository.create).toHaveBeenCalled();
      expect(userRepository.create).toHaveBeenCalled();
      expect(jwtService.generateTokenPair).toHaveBeenCalled();
    });

    it('should throw ConflictError if email already exists', async () => {
      userRepository.findByEmail.mockResolvedValue(mockAdminUser);

      await expect(authService.register(validRegistration)).rejects.toThrow(
        'An account with this email already exists'
      );
    });

    it('should hash the password before storing', async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      companyRepository.create.mockResolvedValue(mockCompany);
      userRepository.create.mockResolvedValue(mockAdminUser);
      jwtService.generateTokenPair.mockReturnValue(mockTokens);
      userRepository.updateLastLogin.mockResolvedValue(true);

      await authService.register(validRegistration);

      const createCall = userRepository.create.mock.calls[0][0];
      expect(createCall.password).not.toBe(validRegistration.password);
      expect(createCall.password).toMatch(/^\$2[aby]\$.{56}$/);
    });
  });

  // ─── Login ─────────────────────────────────

  describe('login', () => {
    it('should login and return user with tokens', async () => {
      const hashedPassword = await bcrypt.hash(validLogin.password, 10);
      userRepository.findByEmail.mockResolvedValue({
        ...mockAdminUser,
        password: hashedPassword,
      });
      jwtService.generateTokenPair.mockReturnValue(mockTokens);
      userRepository.updateLastLogin.mockResolvedValue(true);

      const result = await authService.login(validLogin);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken');
      expect(result.user).not.toHaveProperty('password');
    });

    it('should throw AuthenticationError for wrong password', async () => {
      userRepository.findByEmail.mockResolvedValue({
        ...mockAdminUser,
        password: await bcrypt.hash('DifferentPassword!', 10),
      });

      await expect(authService.login(validLogin)).rejects.toThrow(
        'Invalid email or password'
      );
    });

    it('should throw AuthenticationError for non-existent email', async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      await expect(authService.login(validLogin)).rejects.toThrow(
        'Invalid email or password'
      );
    });

    it('should throw AuthenticationError for inactive user', async () => {
      userRepository.findByEmail.mockResolvedValue({
        ...mockAdminUser,
        isActive: false,
      });

      await expect(authService.login(validLogin)).rejects.toThrow(
        'Account has been deactivated'
      );
    });
  });

  // ─── Refresh Token ─────────────────────────

  describe('refreshToken', () => {
    it('should return new access token for valid refresh token', async () => {
      jwtService.verifyToken.mockReturnValue({ userId: mockAdminUser.id });
      userRepository.findById.mockResolvedValue({ ...mockAdminUser, isActive: true });
      jwtService.generateAccessToken.mockReturnValue('new-access-token');

      const result = await authService.refreshToken('valid-refresh-token');

      expect(result).toHaveProperty('accessToken', 'new-access-token');
    });

    it('should throw for invalid refresh token', async () => {
      jwtService.verifyToken.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(authService.refreshToken('invalid-token')).rejects.toThrow();
    });
  });

  // ─── Get Profile ──────────────────────────

  describe('getProfile', () => {
    it('should return sanitized user profile', async () => {
      userRepository.findById.mockResolvedValue(mockAdminUser);

      const result = await authService.getProfile(mockAdminUser.id);

      expect(result).not.toHaveProperty('password');
      expect(result).toHaveProperty('email', mockAdminUser.email);
    });

    it('should throw NotFoundError for non-existent user', async () => {
      userRepository.findById.mockResolvedValue(null);

      await expect(authService.getProfile('non-existent')).rejects.toThrow(
        'User not found'
      );
    });
  });

  // ─── Forgot Password ─────────────────────

  describe('forgotPassword', () => {
    it('should not throw for non-existent email (security)', async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      await expect(
        authService.forgotPassword('nonexistent@test.com')
      ).resolves.toBeUndefined();
    });
  });
});
