/**
 * Users Service — Unit Tests
 */

jest.mock('../../src/repositories/user.repository');
jest.mock('../../src/services/email.service');

const usersService = require('../../src/services/users.service');
const userRepository = require('../../src/repositories/user.repository');
const {
  mockAdminUser,
  mockSalesAgent,
  mockCompany,
} = require('../fixtures/test-data');

const companyId = mockCompany.id;

describe('UsersService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── getAll ────────────────────────────────

  describe('getAll', () => {
    it('should return paginated users for a company', async () => {
      userRepository.findByCompany.mockResolvedValue({
        users: [mockAdminUser, mockSalesAgent],
        total: 2,
      });

      const result = await usersService.getAll(companyId, { skip: 0, limit: 50 });

      expect(result.users).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(userRepository.findByCompany).toHaveBeenCalledWith(companyId, {
        skip: 0,
        limit: 50,
      });
    });
  });

  // ─── getById ───────────────────────────────

  describe('getById', () => {
    it('should return user without sensitive fields', async () => {
      userRepository.findById.mockResolvedValue(mockAdminUser);

      const result = await usersService.getById(mockAdminUser.id, companyId);

      expect(result).not.toHaveProperty('password');
      expect(result).toHaveProperty('email', mockAdminUser.email);
    });

    it('should throw NotFoundError for non-existent user', async () => {
      userRepository.findById.mockResolvedValue(null);

      await expect(
        usersService.getById('non-existent', companyId)
      ).rejects.toThrow('User not found');
    });

    it('should throw AuthorizationError for different company', async () => {
      userRepository.findById.mockResolvedValue({
        ...mockAdminUser,
        companyId: 'different-company',
      });

      await expect(
        usersService.getById(mockAdminUser.id, companyId)
      ).rejects.toThrow('You cannot access this user');
    });
  });

  // ─── create ────────────────────────────────

  describe('create', () => {
    it('should create user with temp password and return both', async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.create.mockResolvedValue(mockSalesAgent);

      const result = await usersService.create(companyId, {
        email: 'newagent@test.com',
        firstName: 'New',
        lastName: 'Agent',
        role: 'SALES_AGENT',
      });

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('tempPassword');
      expect(result.tempPassword).toHaveLength(12);
    });

    it('should throw ConflictError for duplicate email', async () => {
      userRepository.findByEmail.mockResolvedValue(mockAdminUser);

      await expect(
        usersService.create(companyId, {
          email: mockAdminUser.email,
          firstName: 'Test',
          lastName: 'User',
          role: 'SALES_AGENT',
        })
      ).rejects.toThrow('A user with this email already exists');
    });
  });

  // ─── delete ────────────────────────────────

  describe('delete', () => {
    it('should prevent self-deletion', async () => {
      await expect(
        usersService.delete(mockAdminUser.id, companyId, mockAdminUser.id)
      ).rejects.toThrow('You cannot delete your own account');
    });

    it('should soft-delete user', async () => {
      userRepository.findById.mockResolvedValue(mockSalesAgent);
      userRepository.delete.mockResolvedValue({ ...mockSalesAgent, isActive: false });

      const result = await usersService.delete(
        mockSalesAgent.id,
        companyId,
        mockAdminUser.id
      );

      expect(userRepository.delete).toHaveBeenCalledWith(mockSalesAgent.id);
    });
  });

  // ─── updatePermissions ─────────────────────

  describe('updatePermissions', () => {
    it('should update user permissions', async () => {
      userRepository.findById.mockResolvedValue(mockSalesAgent);
      userRepository.update.mockResolvedValue({
        ...mockSalesAgent,
        permissions: ['view_leads', 'view_dashboard'],
      });

      const result = await usersService.updatePermissions(
        mockSalesAgent.id,
        companyId,
        ['view_leads', 'view_dashboard']
      );

      expect(userRepository.update).toHaveBeenCalledWith(mockSalesAgent.id, {
        permissions: ['view_leads', 'view_dashboard'],
      });
    });
  });
});
