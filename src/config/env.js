/**
 * Environment Configuration
 * Validates all required environment variables at startup using Zod.
 * Fail-fast if any required variable is missing or invalid.
 * In test environment, provides sensible defaults for all variables.
 *
 * @module config/env
 */

const { z } = require('zod');

/** Test-mode defaults so unit/integration tests don't need a .env file */
const TEST_DEFAULTS = {
  DATABASE_URL: 'postgresql://test:test@localhost:5432/kurchu_test',
  JWT_ACCESS_SECRET: 'test_access_secret_that_is_32_chars_long!!',
  JWT_REFRESH_SECRET: 'test_refresh_secret_that_is_32_chars_long!',
};

const isTest = process.env.NODE_ENV === 'test';

// Inject test defaults if running in test mode
if (isTest) {
  for (const [key, value] of Object.entries(TEST_DEFAULTS)) {
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3001').transform(Number),
  FRONTEND_URL: z.string().default('http://localhost:3000'),

  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  // JWT
  JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET must be at least 32 characters'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),

  // Email (optional in development)
  SMTP_HOST: z.string().default('smtp.gmail.com'),
  SMTP_PORT: z.string().default('587').transform(Number),
  SMTP_USER: z.string().default(''),
  SMTP_PASS: z.string().default(''),
  SMTP_FROM: z.string().default('Kurchu CRM <noreply@kurchucrm.com>'),

  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'debug']).default('debug'),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().default('900000').transform(Number),
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100').transform(Number),
  AUTH_RATE_LIMIT_MAX: z.string().default('5').transform(Number),
});

/**
 * Parse and validate environment variables.
 * Exits process with error details if validation fails (except in test mode).
 */
const parseEnv = () => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Environment validation failed:');
    console.error(result.error.format());
    if (!isTest) {
      process.exit(1);
    }
    // In test mode, return partial defaults to avoid crashing
    return {};
  }

  return result.data;
};

const env = parseEnv();

module.exports = { env };
