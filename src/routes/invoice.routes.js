const { Router } = require('express');
const invoiceController = require('../controllers/invoice.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = Router();

router.use(authenticate);

router
  .route('/')
  .get(invoiceController.getInvoices)
  .post(invoiceController.createInvoice);

router
  .route('/:id')
  .get(invoiceController.getInvoice)
  .put(invoiceController.updateInvoice)
  .delete(invoiceController.deleteInvoice);

module.exports = router;
