/**
 * Catch async errors and pass them to Express next() function
 * This eliminates the need for try-catch blocks in controllers
 * 
 * @param {Function} fn - Async Express middleware/controller function
 * @returns {Function} Express middleware function
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};

module.exports = { catchAsync };
