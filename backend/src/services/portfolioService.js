/**
 * Portfolio Service
 * Business logic for portfolio tracking and calculation
 */
const Holding = require('../models/Holding');
const Stock = require('../models/Stock');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const tradingEngine = require('../core/tradingEngine');

/**
 * Get user's complete portfolio
 * @param {number} userId - User ID
 * @returns {Promise<object>} Portfolio data
 */
async function getPortfolio(userId) {
  // Get user data
  const user = await User.getUserById(userId);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // Get holdings
  const holdings = await Holding.getHoldings(userId);
  
  // Build current prices map
  const currentPrices = {};
  for (const holding of holdings) {
    currentPrices[holding.stock_id] = parseFloat(holding.current_price);
  }
  
  // Calculate portfolio value using core logic
  const portfolioData = holdings.map(h => ({
    stockId: h.stock_id,
    quantity: h.quantity,
    averageCost: parseFloat(h.average_cost)
  }));
  
  const portfolioValue = tradingEngine.calculatePortfolioValue(portfolioData, currentPrices);
  
  return {
    userId: user.id,
    userName: user.name,
    cashBalance: parseFloat(user.balance),
    holdings: portfolioValue.breakdown.map(item => ({
      stockId: item.stockId,
      stockName: holdings.find(h => h.stock_id === item.stockId)?.stock_name,
      stockSymbol: holdings.find(h => h.stock_id === item.stockId)?.stock_symbol,
      quantity: item.quantity,
      averageCost: item.averageCost,
      currentPrice: item.currentPrice,
      currentValue: item.currentValue,
      gainLoss: item.gainLoss,
      gainLossPercent: item.gainLossPercent
    })),
    portfolioValue: portfolioValue.totalValue,
    totalValue: parseFloat(user.balance) + portfolioValue.totalValue,
    calculatedAt: portfolioValue.calculatedAt
  };
}

/**
 * Get user's transaction history
 * @param {number} userId - User ID
 * @param {number} limit - Limit number of results
 * @returns {Promise<array>} Transaction history
 */
async function getTransactionHistory(userId, limit = 50) {
  const transactions = await Transaction.getUserTransactions(userId);
  
  return transactions.slice(0, limit).map(tx => ({
    id: tx.id,
    stockId: tx.stock_id,
    stockName: tx.stock_name,
    stockSymbol: tx.stock_symbol,
    type: tx.type,
    quantity: tx.quantity,
    price: parseFloat(tx.price),
    totalAmount: parseFloat(tx.total_amount),
    timestamp: tx.timestamp
  }));
}

/**
 * Get leaderboard based on total portfolio value
 * @returns {Promise<array>} Leaderboard
 */
async function getLeaderboard() {
  const users = await User.getAllUsers();
  
  // Calculate portfolio value for each user
  const leaderboard = [];
  
  for (const user of users) {
    const holdings = await Holding.getHoldings(user.id);
    
    // Build current prices map
    const currentPrices = {};
    for (const holding of holdings) {
      currentPrices[holding.stock_id] = parseFloat(holding.current_price);
    }
    
    // Calculate portfolio value
    const portfolioData = holdings.map(h => ({
      stockId: h.stock_id,
      quantity: h.quantity,
      averageCost: parseFloat(h.average_cost)
    }));
    
    const portfolioValue = tradingEngine.calculatePortfolioValue(portfolioData, currentPrices);
    
    leaderboard.push({
      userId: user.id,
      userName: user.name,
      teamId: user.team_id,
      teamName: user.team_name || null,
      cashBalance: parseFloat(user.balance),
      portfolioValue: portfolioValue.totalValue,
      totalValue: parseFloat(user.balance) + portfolioValue.totalValue,
      isAdmin: user.is_admin === 1
    });
  }
  
  // Sort by total value descending
  leaderboard.sort((a, b) => b.totalValue - a.totalValue);
  
  return leaderboard;
}

module.exports = {
  getPortfolio,
  getTransactionHistory,
  getLeaderboard
};
