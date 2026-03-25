/**
 * Transaction Model
 * Database operations for transactions
 */
const db = require('../config/database');

/**
 * Create a new transaction
 * @param {object} transactionData - Transaction data
 * @returns {Promise<object>} Created transaction
 */
async function createTransaction(transactionData) {
  const { userId, stockId, type, quantity, price, totalAmount } = transactionData;
  
  const sql = `
    INSERT INTO transactions (user_id, stock_id, type, quantity, price, total_amount)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  const result = await db.query(sql, [userId, stockId, type, quantity, price, totalAmount]);
  
  return getTransactionById(result.insertId);
}

/**
 * Get transaction by ID
 * @param {number} id - Transaction ID
 * @returns {Promise<object|null>} Transaction or null
 */
async function getTransactionById(id) {
  const sql = `
    SELECT t.*, u.name as user_name, s.name as stock_name, s.symbol as stock_symbol
    FROM transactions t
    JOIN users u ON t.user_id = u.id
    JOIN stocks s ON t.stock_id = s.id
    WHERE t.id = ?
  `;
  
  const rows = await db.query(sql, [id]);
  return rows[0] || null;
}

/**
 * Get all transactions for a user
 * @param {number} userId - User ID
 * @returns {Promise<array>} Array of transactions
 */
async function getUserTransactions(userId) {
  const sql = `
    SELECT t.*, s.name as stock_name, s.symbol as stock_symbol
    FROM transactions t
    JOIN stocks s ON t.stock_id = s.id
    WHERE t.user_id = ?
    ORDER BY t.timestamp DESC
  `;
  
  return await db.query(sql, [userId]);
}

/**
 * Get all transactions (admin)
 * @returns {Promise<array>} Array of all transactions
 */
async function getAllTransactions() {
  const sql = `
    SELECT t.*, u.name as user_name, s.name as stock_name, s.symbol as stock_symbol
    FROM transactions t
    JOIN users u ON t.user_id = u.id
    JOIN stocks s ON t.stock_id = s.id
    ORDER BY t.timestamp DESC
  `;
  
  return await db.query(sql);
}

/**
 * Get transactions by stock ID
 * @param {number} stockId - Stock ID
 * @returns {Promise<array>} Array of transactions
 */
async function getStockTransactions(stockId) {
  const sql = `
    SELECT t.*, u.name as user_name
    FROM transactions t
    JOIN users u ON t.user_id = u.id
    WHERE t.stock_id = ?
    ORDER BY t.timestamp DESC
  `;
  
  return await db.query(sql, [stockId]);
}

/**
 * Get recent transactions
 * @param {number} limit - Limit number of results
 * @returns {Promise<array>} Array of recent transactions
 */
async function getRecentTransactions(limit = 50) {
  const sql = `
    SELECT t.*, u.name as user_name, s.name as stock_name, s.symbol as stock_symbol
    FROM transactions t
    JOIN users u ON t.user_id = u.id
    JOIN stocks s ON t.stock_id = s.id
    ORDER BY t.timestamp DESC
    LIMIT ?
  `;
  
  return await db.query(sql, [limit]);
}

module.exports = {
  createTransaction,
  getTransactionById,
  getUserTransactions,
  getAllTransactions,
  getStockTransactions,
  getRecentTransactions
};
