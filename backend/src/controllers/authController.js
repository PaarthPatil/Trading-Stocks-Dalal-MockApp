/**
 * Authentication Controller
 * Handles /auth endpoints
 */
const authService = require('../services/authService');

/**
 * POST /signup
 * Register a new user
 */
async function signup(req, res) {
  try {
    const result = await authService.signup(req.body);
    
    res.status(201).json({
      success: true,
      data: result,
      message: 'User registered successfully'
    });
  } catch (error) {
    if (error.message === 'Email already registered') {
      return res.status(409).json({
        success: false,
        error: error.message
      });
    }
    
    if (error.message === 'Name, email, and password are required') {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

/**
 * POST /login
 * Login user
 */
async function login(req, res) {
  try {
    const result = await authService.login(req.body);
    
    res.status(200).json({
      success: true,
      data: result,
      message: 'Login successful'
    });
  } catch (error) {
    if (error.message.includes('Invalid')) {
      return res.status(401).json({
        success: false,
        error: error.message
      });
    }
    
    if (error.message.includes('required')) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

/**
 * GET /me
 * Get current user info
 */
async function getCurrentUser(req, res) {
  try {
    // User info is already attached by auth middleware
    res.status(200).json({
      success: true,
      data: {
        user: req.user
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

module.exports = {
  signup,
  login,
  getCurrentUser
};
