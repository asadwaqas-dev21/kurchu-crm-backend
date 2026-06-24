/**
 * Validation Middleware
 * Generic Zod schema validation for request body, query, and params.
 *
 * @module middleware/validation
 */

const { ValidationError } = require('../utils/errors');

/**
 * Validate request body against a Zod schema.
 *
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 * @returns {Function} Express middleware
 */
const validateBody = (schema) => {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      throw new ValidationError('Validation failed', errors);
    }

    req.validatedBody = result.data;
    next();
  };
};

/**
 * Validate request query parameters against a Zod schema.
 *
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 * @returns {Function} Express middleware
 */
const validateQuery = (schema) => {
  return (req, _res, next) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      throw new ValidationError('Query validation failed', errors);
    }

    req.validatedQuery = result.data;
    next();
  };
};

/**
 * Validate request params against a Zod schema.
 *
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 * @returns {Function} Express middleware
 */
const validateParams = (schema) => {
  return (req, _res, next) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      throw new ValidationError('Parameter validation failed', errors);
    }

    req.validatedParams = result.data;
    next();
  };
};

module.exports = { validateBody, validateQuery, validateParams };
