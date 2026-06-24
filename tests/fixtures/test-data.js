/**
 * Test Fixtures
 * Shared mock data and helper functions for unit/integration tests.
 *
 * @module tests/fixtures/test-data
 */

const mockCompany = {
  id: 'company-test-001',
  name: 'Test Company',
  email: 'test@company.com',
  phone: '+92-300-1234567',
  currency: 'PKR',
  timezone: 'Asia/Karachi',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

const mockAdminUser = {
  id: 'user-admin-001',
  email: 'admin@test.com',
  password: '$2b$12$hashedpassword', // bcrypt hash placeholder
  firstName: 'Admin',
  lastName: 'User',
  phone: '+92-300-1111111',
  role: 'ADMIN',
  companyId: mockCompany.id,
  permissions: [
    'view_leads', 'create_leads', 'edit_leads', 'delete_leads',
    'view_bookings', 'create_bookings', 'edit_bookings',
    'view_finance', 'manage_payments',
    'view_users', 'create_users', 'edit_users', 'delete_users',
    'edit_company', 'manage_services', 'manage_lead_sources',
    'view_dashboard', 'view_reports',
  ],
  isActive: true,
  lastLoginAt: null,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

const mockSalesAgent = {
  id: 'user-agent-001',
  email: 'agent@test.com',
  password: '$2b$12$hashedpassword',
  firstName: 'Sales',
  lastName: 'Agent',
  phone: '+92-301-2222222',
  role: 'SALES_AGENT',
  companyId: mockCompany.id,
  permissions: [
    'view_leads', 'create_leads', 'edit_leads',
    'view_bookings', 'create_bookings',
    'view_dashboard',
  ],
  isActive: true,
  lastLoginAt: null,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

const mockLeadSource = {
  id: 'source-001',
  name: 'Website',
  companyId: mockCompany.id,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

const mockService = {
  id: 'service-001',
  name: 'Web Development',
  description: 'Custom website development',
  price: 150000,
  companyId: mockCompany.id,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

const mockLead = {
  id: 'lead-001',
  firstName: 'Test',
  lastName: 'Lead',
  email: 'lead@test.com',
  phone: '+92-300-9999999',
  company: 'Test Corp',
  stage: 'NEW',
  sourceId: mockLeadSource.id,
  createdById: mockAdminUser.id,
  assignedToId: mockSalesAgent.id,
  companyId: mockCompany.id,
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
};

const mockBooking = {
  id: 'booking-001',
  leadId: mockLead.id,
  serviceId: mockService.id,
  status: 'CONFIRMED',
  bookingDate: new Date('2024-01-20'),
  amount: 150000,
  collectedAmount: 75000,
  pendingAmount: 75000,
  companyId: mockCompany.id,
  createdAt: new Date('2024-01-20'),
  updatedAt: new Date('2024-01-20'),
};

const mockAlert = {
  id: 'alert-001',
  type: 'NEW_LEAD',
  title: 'New Lead Received',
  message: 'Test Lead submitted a form',
  severity: 'INFO',
  companyId: mockCompany.id,
  isRead: false,
  readAt: null,
  createdAt: new Date('2024-01-15'),
};

const mockTokens = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
};

/**
 * Registration payload.
 */
const validRegistration = {
  email: 'newuser@test.com',
  password: 'SecurePass123!',
  firstName: 'New',
  lastName: 'User',
  phone: '+92-300-5555555',
  companyName: 'New Company',
};

/**
 * Login payload.
 */
const validLogin = {
  email: 'admin@test.com',
  password: 'SecurePass123!',
};

module.exports = {
  mockCompany,
  mockAdminUser,
  mockSalesAgent,
  mockLeadSource,
  mockService,
  mockLead,
  mockBooking,
  mockAlert,
  mockTokens,
  validRegistration,
  validLogin,
};
