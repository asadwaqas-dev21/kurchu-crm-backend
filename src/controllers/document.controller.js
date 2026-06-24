const documentService = require('../services/document.service');
const { catchAsync } = require('../utils/catch-async');
const { createDocumentSchema } = require('../schemas/document.schema');

const getDocuments = catchAsync(async (req, res) => {
  const companyId = req.companyId;
  const documents = await documentService.getDocuments(companyId);
  res.json({ status: 'success', data: { documents } });
});

const getDocument = catchAsync(async (req, res) => {
  const document = await documentService.getDocumentById(req.params.id, req.companyId);
  res.json({ status: 'success', data: { document } });
});

const createDocument = catchAsync(async (req, res) => {
  const validatedData = createDocumentSchema.parse(req.body);
  const document = await documentService.createDocument(validatedData, req.companyId);
  res.status(201).json({ status: 'success', data: { document } });
});

const deleteDocument = catchAsync(async (req, res) => {
  await documentService.deleteDocument(req.params.id, req.companyId);
  res.status(204).send();
});

module.exports = {
  getDocuments,
  getDocument,
  createDocument,
  deleteDocument,
};
