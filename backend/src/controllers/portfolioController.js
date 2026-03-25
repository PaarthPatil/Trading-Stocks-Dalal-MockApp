/**
 * Portfolio Controller
 * Handles /portfolio endpoints
 */
const portfolioService = require('../services/portfolioService');

/**
 * GET /portfolio
 * Get user's complete portfolio
 */
async function getPortfolio(req, res) {
  try {
    const userId = req.user.userId;
    
    const portfolio = await portfolioService.getPortfolio(userId);
    
    res.status(200).json({
      success: true,
      data: { portfolio }
    });
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({
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
 * GET /portfolio/transactions
 * Get user's transaction history
 */
async function getTransactionHistory(req, res) {
  try {
    const userId = req.user.userId;
    const limit = parseInt(req.query.limit) || 50;
    
    const transactions = await portfolioService.getTransactionHistory(userId, limit);
    
    res.status(200).json({
      success: true,
      data: {
        transactions,
        count: transactions.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

/**
 * GET /leaderboard
 * Get leaderboard (public)
 */
async function getLeaderboard(req, res) {
  try {
    const leaderboard = await portfolioService.getLeaderboard();
    
    res.status(200).json({
      success: true,
      data: { leaderboard }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

module.exports = {
  getPortfolio,
  getTransactionHistory,
  getLeaderboard
};
