/**
 * Authentication Routes
 */
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { validateRequiredFields } = require('../middleware/validation');

// Public routes
router.post('/signup', 
  validateRequiredFields(['name', 'email', 'password']),
  authController.signup
);

router.post('/login',
  validateRequiredFields(['email', 'password']),
  authController.login
);

// Protected route
router.get('/me', authenticateToken, authController.getCurrentUser);

module.exports = router;
