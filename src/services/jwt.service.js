/**
 * JWT Service
 * Token generation and verification logic.
 *
 * @module services/jwt
 */

const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config/jwt');

class JwtService {
  /**
   * Generate an access token (short-lived).
   * @param {string} userId
   * @returns {string}
   */
  generateAccessToken(userId) {
    return jwt.sign(
      { userId, type: 'access' },
      jwtConfig.accessToken.secret,
      { expiresIn: jwtConfig.accessToken.expiresIn }
    );
  }

  /**
   * Generate a refresh token (long-lived).
   * @param {string} userId
   * @returns {string}
   */
  generateRefreshToken(userId) {
    return jwt.sign(
      { userId, type: 'refresh' },
      jwtConfig.refreshToken.secret,
      { expiresIn: jwtConfig.refreshToken.expiresIn }
    );
  }

  /**
   * Generate both access and refresh tokens.
   * @param {string} userId
   * @returns {{ accessToken: string, refreshToken: string }}
   */
  generateTokenPair(userId) {
    return {
      accessToken: this.generateAccessToken(userId),
      refreshToken: this.generateRefreshToken(userId),
    };
  }

  /**
   * Verify and decode a token.
   * @param {string} token
   * @param {'access'|'refresh'} type
   * @returns {object} Decoded payload
   */
  verifyToken(token, type) {
    const secret = type === 'access'
      ? jwtConfig.accessToken.secret
      : jwtConfig.refreshToken.secret;

    return jwt.verify(token, secret);
  }
}

module.exports = new JwtService();
