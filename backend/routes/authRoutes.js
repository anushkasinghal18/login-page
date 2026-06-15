const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Public Authentication endpoints
router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.post('/logout', authController.logout);

// Social logins
router.post('/google', authController.googleLogin);
router.post('/microsoft', authController.microsoftLogin);
router.post('/apple', authController.appleLogin);

// Protected session validation route
router.get('/me', authMiddleware, authController.getCurrentUser);

module.exports = router;
