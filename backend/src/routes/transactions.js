/**
 * Transaction Routes
 */
const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { authenticateToken } = require('../middleware/auth');

// Protected routes - require authentication
router.get('/',
  authenticateToken,
  transactionController.getTransactions
);

router.get('/recent',
  transactionController.getRecentTransactions
);

module.exports = router;
