/**
 * Application Constants
 * Centralized constants for roles, permissions, pagination, etc.
 *
 * @module utils/constants
 */

/** User roles */
const ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  SALES_AGENT: 'SALES_AGENT',
  FINANCE: 'FINANCE',
  SUPPORT: 'SUPPORT',
};

/** Granular permissions */
const PERMISSIONS = {
  // Leads
  VIEW_LEADS: 'view_leads',
  CREATE_LEADS: 'create_leads',
  EDIT_LEADS: 'edit_leads',
  DELETE_LEADS: 'delete_leads',
  ASSIGN_LEADS: 'assign_leads',

  // Bookings
  VIEW_BOOKINGS: 'view_bookings',
  CREATE_BOOKINGS: 'create_bookings',
  EDIT_BOOKINGS: 'edit_bookings',
  DELETE_BOOKINGS: 'delete_bookings',

  // Finance
  VIEW_FINANCE: 'view_finance',
  MANAGE_PAYMENTS: 'manage_payments',
  MANAGE_INVOICES: 'manage_invoices',

  // Users
  VIEW_USERS: 'view_users',
  CREATE_USERS: 'create_users',
  EDIT_USERS: 'edit_users',
  DELETE_USERS: 'delete_users',

  // Company
  EDIT_COMPANY: 'edit_company',
  MANAGE_SERVICES: 'manage_services',
  MANAGE_LEAD_SOURCES: 'manage_lead_sources',

  // Dashboard
  VIEW_DASHBOARD: 'view_dashboard',
  VIEW_REPORTS: 'view_reports',
};

/** Default permissions per role */
const DEFAULT_ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: Object.values(PERMISSIONS),
  [ROLES.MANAGER]: [
    PERMISSIONS.VIEW_LEADS,
    PERMISSIONS.CREATE_LEADS,
    PERMISSIONS.EDIT_LEADS,
    PERMISSIONS.ASSIGN_LEADS,
    PERMISSIONS.VIEW_BOOKINGS,
    PERMISSIONS.CREATE_BOOKINGS,
    PERMISSIONS.EDIT_BOOKINGS,
    PERMISSIONS.VIEW_FINANCE,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_REPORTS,
  ],
  [ROLES.SALES_AGENT]: [
    PERMISSIONS.VIEW_LEADS,
    PERMISSIONS.CREATE_LEADS,
    PERMISSIONS.EDIT_LEADS,
    PERMISSIONS.VIEW_BOOKINGS,
    PERMISSIONS.CREATE_BOOKINGS,
    PERMISSIONS.VIEW_DASHBOARD,
  ],
  [ROLES.FINANCE]: [
    PERMISSIONS.VIEW_BOOKINGS,
    PERMISSIONS.VIEW_FINANCE,
    PERMISSIONS.MANAGE_PAYMENTS,
    PERMISSIONS.MANAGE_INVOICES,
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_REPORTS,
  ],
  [ROLES.SUPPORT]: [
    PERMISSIONS.VIEW_LEADS,
    PERMISSIONS.VIEW_BOOKINGS,
    PERMISSIONS.VIEW_DASHBOARD,
  ],
};

/** Pagination defaults */
const PAGINATION = {
  DEFAULT_SKIP: 0,
  DEFAULT_LIMIT: 50,
  MAX_LIMIT: 200,
};

/** Lead stage order for pipeline */
const LEAD_STAGE_ORDER = [
  'NEW',
  'CONTACTED',
  'INTERESTED',
  'DEMO',
  'NEGOTIATION',
  'WON',
  'LOST',
];

/** Password requirements */
const PASSWORD_REQUIREMENTS = {
  MIN_LENGTH: 8,
  REQUIRE_UPPERCASE: true,
  REQUIRE_NUMBER: true,
  REQUIRE_SPECIAL: true,
};

/** Bcrypt salt rounds */
const SALT_ROUNDS = 12;

module.exports = {
  ROLES,
  PERMISSIONS,
  DEFAULT_ROLE_PERMISSIONS,
  PAGINATION,
  LEAD_STAGE_ORDER,
  PASSWORD_REQUIREMENTS,
  SALT_ROUNDS,
};
