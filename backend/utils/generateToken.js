const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  // Use _id for mongoose documents / mock objects, or id
  const userId = user._id || user.id;
  
  return jwt.sign(
    {
      id: userId,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET || 'dev_secret_key_123456789_placeholder',
    {
      expiresIn: '7d' // JWT expires in 7 days
    }
  );
};

module.exports = generateToken;
