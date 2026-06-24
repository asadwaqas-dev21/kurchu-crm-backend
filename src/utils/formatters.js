/**
 * Response Formatters
 * Standardized API response shapes for consistency.
 *
 * @module utils/formatters
 */

/**
 * Format a successful API response.
 *
 * @param {object} data - Response data
 * @param {string} [message] - Optional success message
 * @param {number} [statusCode=200] - HTTP status code
 * @returns {{ success: boolean, message: string, data: object }}
 */
const successResponse = (data, message = 'Success', statusCode = 200) => ({
  success: true,
  statusCode,
  message,
  data,
});

/**
 * Format a paginated API response.
 *
 * @param {Array} items - Array of items
 * @param {number} total - Total count of items
 * @param {number} skip - Number of items skipped
 * @param {number} limit - Max items per page
 * @returns {{ success: boolean, data: object, pagination: object }}
 */
const paginatedResponse = (items, total, skip = 0, limit = 50) => ({
  success: true,
  data: items,
  pagination: {
    total,
    skip,
    limit,
    pages: Math.ceil(total / limit),
    hasMore: skip + limit < total,
  },
});

/**
 * Format an error API response.
 *
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {Array} [details] - Optional error details
 * @returns {{ success: boolean, error: object }}
 */
const errorResponse = (message, statusCode, details = null) => ({
  success: false,
  error: {
    message,
    statusCode,
    ...(details && { details }),
  },
});

module.exports = {
  successResponse,
  paginatedResponse,
  errorResponse,
};
