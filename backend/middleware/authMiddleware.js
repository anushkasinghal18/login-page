const jwt = require('jsonwebtoken');
const UserService = require('../services/userService');

const authMiddleware = async (req, res, next) => {
  let token;

  // 1. Check for token in Authorization Header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } 
  // 2. Fallback check in Cookies
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token is missing'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_key_123456789_placeholder');
    
    const user = await UserService.findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, user not found'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been disabled. Contact your administrator.'
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error(`JWT validation error: ${error.message}`);
    return res.status(401).json({
      success: false,
      message: 'Not authorized, invalid token'
    });
  }
};

module.exports = authMiddleware;
