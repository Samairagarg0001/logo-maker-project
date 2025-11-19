const jwt = require('jsonwebtoken');

const requireToken = (req, res, next) => {
  // 1. Get token from header
  const token = req.header('x-auth-token');

  // 2. Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // 3. Verify token
  try {
    const decoded = jwt.verify(token, 'mySecretKey'); // Must match key in auth.js
    req.user = decoded.user; // Attach user info to request
    next(); // Allow access
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = requireToken;