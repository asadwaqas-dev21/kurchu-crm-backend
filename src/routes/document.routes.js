const { Router } = require('express');
const documentController = require('../controllers/document.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = Router();

router.use(authenticate);

router
  .route('/')
  .get(documentController.getDocuments)
  .post(documentController.createDocument);

router
  .route('/:id')
  .get(documentController.getDocument)
  .delete(documentController.deleteDocument);

module.exports = router;
