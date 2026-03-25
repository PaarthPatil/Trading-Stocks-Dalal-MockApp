/**
 * Stock Routes
 */
const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

// Public route - get all stocks
router.get('/', stockController.getAllStocks);

// Protected routes
router.get('/:id', stockController.getStockById);

// Admin only routes
router.post('/', 
  authenticateToken, 
  authorizeAdmin,
  stockController.createStock
);

router.put('/:id/price',
  authenticateToken,
  authorizeAdmin,
  stockController.updateStockPrice
);

module.exports = router;
