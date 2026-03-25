/**
 * Portfolio Routes
 */
const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const { authenticateToken } = require('../middleware/auth');

// Protected routes - require authentication
router.get('/',
  authenticateToken,
  portfolioController.getPortfolio
);

router.get('/transactions',
  authenticateToken,
  portfolioController.getTransactionHistory
);

// Public leaderboard
router.get('/leaderboard',
  portfolioController.getLeaderboard
);

module.exports = router;
