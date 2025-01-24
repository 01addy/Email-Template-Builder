const jwt = require('jsonwebtoken');
const { supabase } = require('../supabaseClient'); // Ensure correct import

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization') || req.header('x-auth-token');
    if (!authHeader) {
      return res.status(401).json({ msg: 'Authorization token is required' });
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : authHeader;

    if (!token) {
      return res.status(401).json({ msg: 'Token missing from request' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET is not defined in the environment variables');
      return res.status(500).json({ msg: 'Server configuration error' });
    }

    const decoded = jwt.verify(token, secret);

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', decoded.userId)
      .single();

    if (error || !user) {
      console.error('Error fetching user details:', error || 'User not found');
      return res.status(401).json({ msg: 'User authentication failed' });
    }

    req.user = {
      id: user.user_id,
      email: user.email,
      role: user.role || 'user',
    };

    next();
  } catch (err) {
    console.error('Error during token verification:', err.message);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Token has expired' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ msg: 'Invalid token' });
    }

    res.status(500).json({ msg: 'Internal server error' });
  }
};

module.exports = authMiddleware;
