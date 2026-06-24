const searchService = require('../services/search.service');
const { successResponse } = require('../utils/formatters');
const { catchAsync } = require('../utils/catch-async');

const globalSearch = catchAsync(async (req, res) => {
  const { q } = req.query;
  const results = await searchService.globalSearch(req.companyId, q);
  
  res.status(200).json(
    successResponse(results, 'Global search results retrieved')
  );
});

module.exports = {
  globalSearch,
};
