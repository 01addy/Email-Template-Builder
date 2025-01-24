const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabase } = require('../supabaseClient');

const router = express.Router();

// Helper function for error handling
const handleError = (res, statusCode, message, error = null) => {
  console.error(message, error || '');
  res.status(statusCode).json({ msg: message });
};

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Verify user credentials and check if user exists
  const { data: user, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (fetchError || !user) {
    return res.status(400).json({ msg: 'Invalid email or password' });
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ msg: 'Invalid email or password' });
  }

  // Issue a JWT token
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: '1h',  // Token expires in 1 hour
  });

  res.json({
    msg: 'Login successful',
    token,  // Send token back to client
  });
});

module.exports = router;
