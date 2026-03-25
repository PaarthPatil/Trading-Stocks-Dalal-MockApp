/**
 * Transaction Controller
 * Handles /transactions endpoints
 */
const Transaction = require('../models/Transaction');

/**
 * GET /transactions
 * Get all transactions (user's own or admin view)
 */
async function getTransactions(req, res) {
  try {
    const userId = req.user.userId;
    const isAdmin = req.user.isAdmin;
    
    let transactions;
    
    if (isAdmin) {
      // Admin can see all transactions
      transactions = await Transaction.getAllTransactions();
    } else {
      // Regular users see only their own
      transactions = await Transaction.getUserTransactions(userId);
    }
    
    res.status(200).json({
      success: true,
      data: {
        transactions: transactions.map(tx => ({
          id: tx.id,
          userId: tx.user_id,
          userName: tx.user_name || null,
          stockId: tx.stock_id,
          stockName: tx.stock_name,
          stockSymbol: tx.stock_symbol,
          type: tx.type,
          quantity: tx.quantity,
          price: parseFloat(tx.price),
          totalAmount: parseFloat(tx.total_amount),
          timestamp: tx.timestamp
        })),
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
 * GET /transactions/recent
 * Get recent transactions (public or limited view)
 */
async function getRecentTransactions(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 50;
    
    const transactions = await Transaction.getRecentTransactions(limit);
    
    res.status(200).json({
      success: true,
      data: {
        transactions: transactions.map(tx => ({
          id: tx.id,
          userId: tx.user_id,
          userName: tx.user_name || null,
          stockId: tx.stock_id,
          stockName: tx.stock_name,
          stockSymbol: tx.stock_symbol,
          type: tx.type,
          quantity: tx.quantity,
          price: parseFloat(tx.price),
          totalAmount: parseFloat(tx.total_amount),
          timestamp: tx.timestamp
        })),
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

module.exports = {
  getTransactions,
  getRecentTransactions
};
