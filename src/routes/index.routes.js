/**
 * Main Route Aggregator
 * Mounts all sub-routers under their respective prefixes.
 *
 * @module routes/index
 */

const express = require('express');

const authRoutes = require('./auth.routes');
const usersRoutes = require('./users.routes');
const companyRoutes = require('./company.routes');
const leadSourcesRoutes = require('./lead-sources.routes');
const dashboardRoutes = require('./dashboard.routes');
const leadRoutes = require('./lead.routes');
const followUpRoutes = require('./follow-up.routes');
const bookingRoutes = require('./booking.routes');
const itineraryRoutes = require('./itinerary.routes');
const invoiceRoutes = require('./invoice.routes');
const documentRoutes = require('./document.routes');
const searchRoutes = require('./search.routes');

const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/company', companyRoutes);
router.use('/lead-sources', leadSourcesRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/leads', leadRoutes);
router.use('/follow-ups', followUpRoutes);
router.use('/bookings', bookingRoutes);
router.use('/itineraries', itineraryRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/documents', documentRoutes);
router.use('/search', searchRoutes);

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
