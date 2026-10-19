const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/constants');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  let token = null;

  if (authHeader) {
    token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;
  } else if (req.query && req.query.token) {
    token = req.query.token;
  }
  
  if (!token) {
    return res.status(401).json({ 
      error: 'Akses ditolak. Token tidak ditemukan.' 
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expired. Silakan login ulang.' 
      });
    }
    return res.status(401).json({ 
      error: 'Token tidak valid.' 
    });
  }
}

module.exports = { authMiddleware };
