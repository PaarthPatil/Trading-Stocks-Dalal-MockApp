/**
 * Database Connection Pool
 */
const mysql = require('mysql2/promise');
const config = require('./app');

let pool;

/**
 * Initialize database connection pool
 */
async function initializePool() {
  try {
    pool = mysql.createPool(config.db);
    
    // Test connection
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    
    return pool;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    throw error;
  }
}

/**
 * Get database connection pool
 * @returns {object} Database pool
 */
function getPool() {
  if (!pool) {
    throw new Error('Database pool not initialized. Call initializePool() first.');
  }
  return pool;
}

/**
 * Execute a database query
 * @param {string} sql - SQL query
 * @param {array} params - Query parameters
 * @returns {Promise} Query result
 */
async function query(sql, params = []) {
  const connection = await getPool().getConnection();
  try {
    const [rows] = await connection.execute(sql, params);
    return rows;
  } finally {
    connection.release();
  }
}

/**
 * Execute a transaction with multiple queries
 * @param {Function} callback - Async function that receives connection
 * @returns {Promise} Transaction result
 */
async function transaction(callback) {
  const connection = await getPool().getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  initializePool,
  getPool,
  query,
  transaction
};
