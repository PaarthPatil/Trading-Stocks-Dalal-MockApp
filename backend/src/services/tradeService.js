/**
 * Trade Service
 * Business logic for buy/sell operations
 */
const db = require('../config/database');
const Stock = require('../models/Stock');
const { emitTradeExecuted, emitPortfolioUpdate } = require('../config/socket');
const tradingEngine = require('../core/tradingEngine');
const User = require('../models/User');
const Stock = require('../models/Stock');
const Holding = require('../models/Holding');
const Transaction = require('../models/Transaction');

/**
 * Execute a buy order
 * @param {number} userId - User ID
 * @param {number} stockId - Stock ID
 * @param {number} quantity - Quantity to buy
 * @returns {Promise<object>} Transaction result
 */
async function executeBuy(userId, stockId, quantity) {
  // Validate trade parameters
  const validation = tradingEngine.validateTrade('BUY', quantity);
  if (!validation.valid) {
    throw new Error(validation.errors.join(', '));
  }

  return await db.transaction(async (connection) => {
    // Get user and stock data
    const user = await connection.execute('SELECT * FROM users WHERE id = ?', [userId]);
    const stock = await connection.execute('SELECT * FROM stocks WHERE id = ?', [stockId]);
    
    if (!user[0][0]) {
      throw new Error('User not found');
    }
    
    if (!stock[0][0]) {
      throw new Error('Stock not found');
    }
    
    const userData = user[0][0];
    const stockData = stock[0][0];
    
    const balance = parseFloat(userData.balance);
    const price = parseFloat(stockData.current_price);
    
    // Process buy using core logic
    const buyResult = tradingEngine.processBuy(balance, price, quantity);
    
    if (!buyResult.success) {
      throw new Error(buyResult.error);
    }
    
    // Update user balance
    await connection.execute('UPDATE users SET balance = ? WHERE id = ?', [buyResult.newBalance, userId]);
    
    // Update or create holding
    await connection.execute(
      `INSERT INTO holdings (user_id, stock_id, quantity, average_cost) 
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
         quantity = quantity + VALUES(quantity),
         average_cost = ((quantity * average_cost) + (VALUES(quantity) * VALUES(price))) / (quantity + VALUES(quantity))`,
      [userId, stockId, quantity, price]
    );
    
    // Create transaction record
    const transactionResult = await connection.execute(
      'INSERT INTO transactions (user_id, stock_id, type, quantity, price, total_amount) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, stockId, 'BUY', quantity, price, buyResult.cost]
    );
    
    // Emit real-time event
    const tradeData = {
      id: transactionResult[0].insertId,
      userId,
      stockId,
      stockSymbol: stockData.symbol,
      type: 'BUY',
      quantity,
      price,
      totalAmount: buyResult.cost,
      timestamp: new Date().toISOString()
    };
    emitTradeExecuted(tradeData, userId);
    emitPortfolioUpdate(userId, { action: 'BUY', ...tradeData });
    
    return {
      success: true,
      message: 'Buy order executed successfully',
      data: {
        stockId,
        quantity,
        price,
        totalCost: buyResult.cost,
        newBalance: buyResult.newBalance,
        transactionId: transactionResult[0].insertId
      }
    };
  });
}

/**
 * Execute a sell order
 * @param {number} userId - User ID
 * @param {number} stockId - Stock ID
 * @param {number} quantity - Quantity to sell
 * @returns {Promise<object>} Transaction result
 */
async function executeSell(userId, stockId, quantity) {
  // Validate trade parameters
  const validation = tradingEngine.validateTrade('SELL', quantity);
  if (!validation.valid) {
    throw new Error(validation.errors.join(', '));
  }

  return await db.transaction(async (connection) => {
    // Get user and stock data
    const user = await connection.execute('SELECT * FROM users WHERE id = ?', [userId]);
    const stock = await connection.execute('SELECT * FROM stocks WHERE id = ?', [stockId]);
    
    if (!user[0][0]) {
      throw new Error('User not found');
    }
    
    if (!stock[0][0]) {
      throw new Error('Stock not found');
    }
    
    const userData = user[0][0];
    const stockData = stock[0][0];
    
    // Get current holdings
    const holding = await connection.execute(
      'SELECT * FROM holdings WHERE user_id = ? AND stock_id = ?',
      [userId, stockId]
    );
    
    if (!holding[0][0] || holding[0][0].quantity < quantity) {
      throw new Error('Insufficient holdings');
    }
    
    const price = parseFloat(stockData.current_price);
    
    // Process sell using core logic
    const sellResult = tradingEngine.processSell(holding[0][0].quantity, price, quantity);
    
    if (!sellResult.success) {
      throw new Error(sellResult.error);
    }
    
    // Calculate revenue
    const revenue = price * quantity;
    const newBalance = parseFloat(userData.balance) + revenue;
    
    // Update user balance
    await connection.execute('UPDATE users SET balance = ? WHERE id = ?', [newBalance, userId]);
    
    // Reduce holding
    await connection.execute(
      'UPDATE holdings SET quantity = quantity - ? WHERE user_id = ? AND stock_id = ?',
      [quantity, userId, stockId]
    );
    
    // Create transaction record
    const transactionResult = await connection.execute(
      'INSERT INTO transactions (user_id, stock_id, type, quantity, price, total_amount) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, stockId, 'SELL', quantity, price, revenue]
    );
    
    // Emit real-time event
    const tradeData = {
      id: transactionResult[0].insertId,
      userId,
      stockId,
      stockSymbol: stockData.symbol,
      type: 'SELL',
      quantity,
      price,
      totalAmount: revenue,
      timestamp: new Date().toISOString()
    };
    emitTradeExecuted(tradeData, userId);
    emitPortfolioUpdate(userId, { action: 'SELL', ...tradeData });
    
    return {
      success: true,
      message: 'Sell order executed successfully',
      data: {
        stockId,
        quantity,
        price,
        revenue,
        newBalance,
        transactionId: transactionResult[0].insertId
      }
    };
  });
}

/**
 * Check if trading is currently frozen
 * @returns {Promise<boolean>} Is trading frozen
 */
async function isTradingFrozen() {
  const result = await db.query(
    "SELECT setting_value FROM system_settings WHERE setting_key = 'trading_frozen'"
  );
  
  return result[0] && result[0].setting_value === 'true';
}

module.exports = {
  executeBuy,
  executeSell,
  isTradingFrozen
};
