const invoiceService = require('../services/invoice.service');
const { catchAsync } = require('../utils/catch-async');
const { createInvoiceSchema, updateInvoiceSchema } = require('../schemas/invoice.schema');

const getInvoices = catchAsync(async (req, res) => {
  const companyId = req.companyId;
  const invoices = await invoiceService.getInvoices(companyId);
  res.json({ status: 'success', data: { invoices } });
});

const getInvoice = catchAsync(async (req, res) => {
  const invoice = await invoiceService.getInvoiceById(req.params.id, req.companyId);
  res.json({ status: 'success', data: { invoice } });
});

const createInvoice = catchAsync(async (req, res) => {
  const validatedData = createInvoiceSchema.parse(req.body);
  const invoice = await invoiceService.createInvoice(validatedData, req.companyId);
  res.status(201).json({ status: 'success', data: { invoice } });
});

const updateInvoice = catchAsync(async (req, res) => {
  const validatedData = updateInvoiceSchema.parse(req.body);
  const invoice = await invoiceService.updateInvoice(req.params.id, validatedData, req.companyId);
  res.json({ status: 'success', data: { invoice } });
});

const deleteInvoice = catchAsync(async (req, res) => {
  await invoiceService.deleteInvoice(req.params.id, req.companyId);
  res.status(204).send();
});

module.exports = {
  getInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
};
