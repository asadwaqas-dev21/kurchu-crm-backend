/**
 * JWT Configuration
 * Centralized JWT settings sourced from validated environment.
 *
 * @module config/jwt
 */

const { env } = require('./env');

const jwtConfig = {
  accessToken: {
    secret: env.JWT_ACCESS_SECRET,
    expiresIn: env.JWT_ACCESS_EXPIRY,
  },
  refreshToken: {
    secret: env.JWT_REFRESH_SECRET,
    expiresIn: env.JWT_REFRESH_EXPIRY,
  },
};

module.exports = { jwtConfig };
