/**
 * Admin Controller
 * Handles /admin endpoints (admin only)
 */
const db = require('../config/database');
const User = require('../models/User');
const Stock = require('../models/Stock');
const Transaction = require('../models/Transaction');
const portfolioService = require('../services/portfolioService');
const stockService = require('../services/stockService');
const config = require('../config/app');
const { emitMarketEvent, emitLeaderboardUpdate } = require('../config/socket');

/**
 * GET /admin/users
 * Get all users (admin only)
 */
async function getAllUsers(req, res) {
  try {
    const users = await User.getAllUsers();
    
    res.status(200).json({
      success: true,
      data: {
        users: users.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          teamId: user.team_id,
          teamName: user.team_name || null,
          balance: parseFloat(user.balance),
          isAdmin: user.is_admin === 1,
          createdAt: user.created_at
        })),
        count: users.length
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
 * GET /admin/transactions
 * Get all transactions (admin only)
 */
async function getAllTransactions(req, res) {
  try {
    const transactions = await Transaction.getAllTransactions();
    
    res.status(200).json({
      success: true,
      data: {
        transactions: transactions.map(tx => ({
          id: tx.id,
          userId: tx.user_id,
          userName: tx.user_name,
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
 * GET /admin/leaderboard
 * Get complete leaderboard
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

/**
 * POST /admin/freeze-trading
 * Freeze or unfreeze trading (admin only)
 */
async function freezeTrading(req, res) {
  try {
    const { frozen } = req.body;
    
    if (typeof frozen !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'Frozen status must be a boolean'
      });
    }
    
    await db.query(
      "UPDATE system_settings SET setting_value = ? WHERE setting_key = 'trading_frozen'",
      [frozen.toString()]
    );
    
    res.status(200).json({
      success: true,
      data: { frozen },
      message: `Trading ${frozen ? 'frozen' : 'unfrozen'} successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

/**
 * GET /admin/system-status
 * Get system status (admin only)
 */
async function getSystemStatus(req, res) {
  try {
    // Get trading freeze status
    const freezeResult = await db.query(
      "SELECT setting_value FROM system_settings WHERE setting_key = 'trading_frozen'"
    );
    
    const isFrozen = freezeResult[0] && freezeResult[0].setting_value === 'true';
    
    // Get counts
    const userCount = await db.query("SELECT COUNT(*) as count FROM users");
    const stockCount = await db.query("SELECT COUNT(*) as count FROM stocks");
    const transactionCount = await db.query("SELECT COUNT(*) as count FROM transactions");
    
    res.status(200).json({
      success: true,
      data: {
        tradingFrozen: isFrozen,
        stats: {
          totalUsers: parseInt(userCount[0].count),
          totalStocks: parseInt(stockCount[0].count),
          totalTransactions: parseInt(transactionCount[0].count)
        }
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
 * POST /admin/stocks/:id/price
 * Update stock price manually (admin only)
 */
async function updateStockPrice(req, res) {
  try {
    const stockId = parseInt(req.params.id);
    const { price } = req.body;
    
    if (isNaN(stockId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid stock ID'
      });
    }
    
    if (!price || typeof price !== 'number' || price <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Valid price is required'
      });
    }
    
    const stock = await stockService.updateStockPriceManual(stockId, price);
    
    // Log admin action
    await db.query(
      'INSERT INTO admin_actions (admin_id, action_type, description, metadata) VALUES (?, ?, ?, ?)',
      [req.user.userId, 'PRICE_UPDATE', `Updated stock ${stock.name} price to $${price}`, JSON.stringify({ stockId, price })]
    );
    
    res.status(200).json({
      success: true,
      data: { stock },
      message: 'Stock price updated successfully'
    });
  } catch (error) {
    if (error.message === 'Stock not found') {
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
 * GET /admin/stocks
 * Get all stocks with management controls
 */
async function getAllStocksAdmin(req, res) {
  try {
    const stocks = await Stock.getAllStocks();
    
    res.status(200).json({
      success: true,
      data: {
        stocks: stocks.map(stock => ({
          id: stock.id,
          name: stock.name,
          symbol: stock.symbol,
          currentPrice: parseFloat(stock.current_price),
          initialPrice: parseFloat(stock.initial_price),
          createdAt: stock.created_at,
          updatedAt: stock.updated_at
        })),
        count: stocks.length
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
 * POST /admin/market-event
 * Trigger a market event that affects multiple stocks
 */
async function triggerMarketEvent(req, res) {
  try {
    const { eventType, impactPercent, affectedStocks } = req.body;
    
    if (!eventType || !impactPercent || !affectedStocks) {
      return res.status(400).json({
        success: false,
        error: 'Event type, impact percent, and affected stocks are required'
      });
    }
    
    // Update prices of affected stocks
    for (const stockData of affectedStocks) {
      const stock = await Stock.getStockById(stockData.id);
      if (stock) {
        const newPrice = parseFloat(stock.current_price) * (1 + (impactPercent / 100));
        const roundedPrice = Math.round(newPrice * 100) / 100;
        await Stock.updateStockPrice(stockData.id, roundedPrice);
      }
    }
    
    // Log admin action
    await db.query(
      'INSERT INTO admin_actions (admin_id, action_type, description, metadata) VALUES (?, ?, ?, ?)',
      [req.user.userId, 'MARKET_EVENT', `Triggered ${eventType} market event`, JSON.stringify({ eventType, impactPercent, affectedStocks })]
    );
    
    // Emit market event to all clients
    emitMarketEvent({
      eventType,
      impactPercent,
      affectedStocksCount: affectedStocks.length,
      timestamp: new Date().toISOString()
    });
    
    res.status(200).json({
      success: true,
      message: `Market event "${eventType}" triggered successfully`,
      data: {
        eventType,
        impactPercent,
        affectedStocksCount: affectedStocks.length
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
 * GET /admin/actions
 * Get admin action logs
 */
async function getAdminActions(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 100;
    
    const actions = await db.query(`
      SELECT aa.*, u.name as admin_name
      FROM admin_actions aa
      JOIN users u ON aa.admin_id = u.id
      ORDER BY aa.timestamp DESC
      LIMIT ?
    `, [limit]);
    
    res.status(200).json({
      success: true,
      data: {
        actions: actions.map(action => ({
          id: action.id,
          adminId: action.admin_id,
          adminName: action.admin_name,
          actionType: action.action_type,
          description: action.description,
          metadata: action.metadata,
          timestamp: action.timestamp
        })),
        count: actions.length
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
  getAllUsers,
  getAllTransactions,
  getLeaderboard,
  freezeTrading,
  getSystemStatus,
  updateStockPrice,
  getAllStocksAdmin,
  triggerMarketEvent,
  getAdminActions
};
