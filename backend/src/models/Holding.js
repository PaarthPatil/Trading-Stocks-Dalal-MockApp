/**
 * Holding Model
 * Database operations for holdings
 */
const db = require('../config/database');

/**
 * Get user's holdings
 * @param {number} userId - User ID
 * @returns {Promise<array>} Array of holdings
 */
async function getHoldings(userId) {
  const sql = `
    SELECT h.*, s.name as stock_name, s.symbol as stock_symbol, s.current_price
    FROM holdings h
    JOIN stocks s ON h.stock_id = s.id
    WHERE h.user_id = ? AND h.quantity > 0
    ORDER BY s.name
  `;
  
  return await db.query(sql, [userId]);
}

/**
 * Get specific holding
 * @param {number} userId - User ID
 * @param {number} stockId - Stock ID
 * @returns {Promise<object|null>} Holding or null
 */
async function getHolding(userId, stockId) {
  const sql = 'SELECT * FROM holdings WHERE user_id = ? AND stock_id = ?';
  const rows = await db.query(sql, [userId, stockId]);
  
  return rows[0] || null;
}

/**
 * Update or create holding (upsert)
 * @param {object} holdingData - Holding data
 * @returns {Promise<object>} Updated/created holding
 */
async function updateHolding(holdingData) {
  const { userId, stockId, quantity, averageCost } = holdingData;
  
  // Check if holding exists
  const existing = await getHolding(userId, stockId);
  
  if (existing) {
    // Update existing holding
    const sql = 'UPDATE holdings SET quantity = ?, average_cost = ? WHERE user_id = ? AND stock_id = ?';
    await db.query(sql, [quantity, averageCost, userId, stockId]);
  } else {
    // Create new holding
    const sql = 'INSERT INTO holdings (user_id, stock_id, quantity, average_cost) VALUES (?, ?, ?, ?)';
    await db.query(sql, [userId, stockId, quantity, averageCost]);
  }
  
  return getHolding(userId, stockId);
}

/**
 * Add to holding (for buy orders)
 * @param {number} userId - User ID
 * @param {number} stockId - Stock ID
 * @param {number} quantity - Quantity to add
 * @param {number} price - Purchase price per share
 * @returns {Promise<object>} Updated holding
 */
async function addToHolding(userId, stockId, quantity, price) {
  const existing = await getHolding(userId, stockId);
  
  let newQuantity, newAverageCost;
  
  if (existing && existing.quantity > 0) {
    // Calculate weighted average cost
    const totalCost = (existing.quantity * existing.averageCost) + (quantity * price);
    newQuantity = existing.quantity + quantity;
    newAverageCost = totalCost / newQuantity;
  } else {
    newQuantity = quantity;
    newAverageCost = price;
  }
  
  return updateHolding({
    userId,
    stockId,
    quantity: newQuantity,
    averageCost: newAverageCost
  });
}

/**
 * Reduce holding (for sell orders)
 * @param {number} userId - User ID
 * @param {number} stockId - Stock ID
 * @param {number} quantity - Quantity to remove
 * @returns {Promise<object>} Updated holding
 */
async function reduceHolding(userId, stockId, quantity) {
  const existing = await getHolding(userId, stockId);
  
  if (!existing || existing.quantity < quantity) {
    throw new Error('Insufficient holdings');
  }
  
  const newQuantity = existing.quantity - quantity;
  
  // Keep the same average cost when selling
  return updateHolding({
    userId,
    stockId,
    quantity: newQuantity,
    averageCost: existing.averageCost
  });
}

module.exports = {
  getHoldings,
  getHolding,
  updateHolding,
  addToHolding,
  reduceHolding
};
