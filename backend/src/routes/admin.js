/**
 * Admin Routes
 */
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

// All admin routes require authentication and admin privileges
router.use(authenticateToken);
router.use(authorizeAdmin);

// System & Dashboard
router.get('/system-status', adminController.getSystemStatus);
router.get('/users', adminController.getAllUsers);
router.get('/transactions', adminController.getAllTransactions);
router.get('/leaderboard', adminController.getLeaderboard);

// Stock Management
router.get('/stocks', adminController.getAllStocksAdmin);
router.put('/stocks/:id/price', adminController.updateStockPrice);

// Trading Controls
router.post('/freeze-trading', adminController.freezeTrading);

// Market Events
router.post('/market-event', adminController.triggerMarketEvent);

// Audit Logs
router.get('/actions', adminController.getAdminActions);

module.exports = router;
