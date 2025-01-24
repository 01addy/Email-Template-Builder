const express = require('express');
const multer = require('../config/multer'); // Import multer configuration
const path = require('path');
const router = express.Router();

// Handle image upload
router.post('/uploadImage', multer.single('image'), (req, res) => {
  console.log('Upload Image API Hit');
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Generate the public URL for the uploaded image
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    return res.status(200).json({
      message: 'Image uploaded successfully',
      imageUrl,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return res.status(500).json({ message: 'Error uploading file' });
  }
});

module.exports = router;
