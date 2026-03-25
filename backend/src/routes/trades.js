/**
 * Trade Routes
 */
const express = require('express');
const router = express.Router();
const tradeController = require('../controllers/tradeController');
const { authenticateToken } = require('../middleware/auth');

// Protected routes - require authentication
router.post('/buy', 
  authenticateToken,
  tradeController.buy
);

router.post('/sell',
  authenticateToken,
  tradeController.sell
);

module.exports = router;
