/**
 * Stock Model
 * Database operations for stocks
 */
const db = require('../config/database');

/**
 * Create a new stock
 * @param {object} stockData - Stock data
 * @returns {Promise<object>} Created stock
 */
async function createStock(stockData) {
  const { name, symbol, initialPrice } = stockData;
  
  const sql = 'INSERT INTO stocks (name, symbol, current_price, initial_price) VALUES (?, ?, ?, ?)';
  const result = await db.query(sql, [name, symbol, initialPrice, initialPrice]);
  
  return getStockById(result.insertId);
}

/**
 * Get stock by ID
 * @param {number} id - Stock ID
 * @returns {Promise<object|null>} Stock or null
 */
async function getStockById(id) {
  const sql = 'SELECT * FROM stocks WHERE id = ?';
  const rows = await db.query(sql, [id]);
  
  return rows[0] || null;
}

/**
 * Get stock by symbol
 * @param {string} symbol - Stock symbol
 * @returns {Promise<object|null>} Stock or null
 */
async function getStockBySymbol(symbol) {
  const sql = 'SELECT * FROM stocks WHERE symbol = ?';
  const rows = await db.query(sql, [symbol]);
  
  return rows[0] || null;
}

/**
 * Get all stocks
 * @returns {Promise<array>} Array of stocks
 */
async function getAllStocks() {
  const sql = 'SELECT * FROM stocks ORDER BY name';
  return await db.query(sql);
}

/**
 * Update stock price
 * @param {number} stockId - Stock ID
 * @param {number} newPrice - New price
 * @returns {Promise<object>} Updated stock
 */
async function updateStockPrice(stockId, newPrice) {
  const sql = 'UPDATE stocks SET current_price = ? WHERE id = ?';
  await db.query(sql, [newPrice, stockId]);
  
  return getStockById(stockId);
}

/**
 * Get multiple stocks by IDs
 * @param {array} stockIds - Array of stock IDs
 * @returns {Promise<array>} Array of stocks
 */
async function getStocksByIds(stockIds) {
  if (!stockIds || stockIds.length === 0) {
    return [];
  }
  
  const placeholders = stockIds.map(() => '?').join(',');
  const sql = `SELECT * FROM stocks WHERE id IN (${placeholders})`;
  
  return await db.query(sql, stockIds);
}

module.exports = {
  createStock,
  getStockById,
  getStockBySymbol,
  getAllStocks,
  updateStockPrice,
  getStocksByIds
};
