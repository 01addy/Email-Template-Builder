const express = require('express');
const router = express.Router();
const {
  getTemplates,
  createTemplate,
} = require('../controllers/templateController'); // Import necessary controllers
const authMiddleware = require('../middleware/authMiddleware'); // Import authentication middleware

// Route to get templates - protected by authMiddleware
router.get('/', authMiddleware, getTemplates);

// Route to create a new template - protected by authMiddleware
router.post('/', authMiddleware, createTemplate);

module.exports = router;
