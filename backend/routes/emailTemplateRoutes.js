const express = require('express');
const EmailTemplate = require('../models/emailTemplate');
const router = express.Router();

// Helper function for error handling
const handleError = (res, statusCode, message, error = null) => {
  console.error(message, error || '');
  res.status(statusCode).json({ msg: message });
};

// POST to create a new email template
router.post('/uploadEmailConfig', async (req, res) => {
  const { title, subject, content, image } = req.body;

  // Validate required fields
  if (!title || !subject || !content || !image) {
    return handleError(res, 400, 'All fields (title, subject, content, image) are required.');
  }

  try {
    // Create and save the new email template
    const newTemplate = new EmailTemplate({
      title: title.trim(),
      subject: subject.trim(),
      content: content.trim(),
      image: image.trim(),
    });

    const savedTemplate = await newTemplate.save();

    res.status(201).json({
      msg: 'Email template created successfully',
      template: savedTemplate,
    });
  } catch (err) {
    handleError(res, 500, 'Error uploading email template.', err);
  }
});

module.exports = router;
