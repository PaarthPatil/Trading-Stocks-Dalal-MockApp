/**
 * User Model
 * Database operations for users
 */
const db = require('../config/database');

/**
 * Create a new user
 * @param {object} userData - User data
 * @returns {Promise<object>} Created user
 */
async function createUser(userData) {
  const { name, email, passwordHash, teamId, balance } = userData;
  
  const sql = `
    INSERT INTO users (name, email, password_hash, team_id, balance)
    VALUES (?, ?, ?, ?, ?)
  `;
  
  const result = await db.query(sql, [name, email, passwordHash, teamId || null, balance || 100000]);
  
  return getUserById(result.insertId);
}

/**
 * Get user by email
 * @param {string} email - User email
 * @returns {Promise<object|null>} User or null
 */
async function getUserByEmail(email) {
  const sql = 'SELECT * FROM users WHERE email = ?';
  const rows = await db.query(sql, [email]);
  
  return rows[0] || null;
}

/**
 * Get user by ID
 * @param {number} id - User ID
 * @returns {Promise<object|null>} User or null
 */
async function getUserById(id) {
  const sql = 'SELECT * FROM users WHERE id = ?';
  const rows = await db.query(sql, [id]);
  
  return rows[0] || null;
}

/**
 * Update user balance
 * @param {number} userId - User ID
 * @param {number} balance - New balance
 * @returns {Promise<object>} Updated user
 */
async function updateUserBalance(userId, balance) {
  const sql = 'UPDATE users SET balance = ? WHERE id = ?';
  await db.query(sql, [balance, userId]);
  
  return getUserById(userId);
}

/**
 * Get all users
 * @returns {Promise<array>} Array of users
 */
async function getAllUsers() {
  const sql = `SELECT u.id, u.name, u.email, u.team_id, u.balance, u.is_admin, t.team_name 
               FROM users u 
               LEFT JOIN teams t ON u.team_id = t.id 
               ORDER BY u.created_at DESC`;
  
  return await db.query(sql);
}

/**
 * Get users by team ID
 * @param {number} teamId - Team ID
 * @returns {Promise<array>} Array of users
 */
async function getUsersByTeamId(teamId) {
  const sql = 'SELECT * FROM users WHERE team_id = ?';
  return await db.query(sql, [teamId]);
}

/**
 * Check if user is admin
 * @param {number} userId - User ID
 * @returns {Promise<boolean>} Is admin
 */
async function isUserAdmin(userId) {
  const user = await getUserById(userId);
  return user && user.is_admin === 1;
}

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  updateUserBalance,
  getAllUsers,
  getUsersByTeamId,
  isUserAdmin
};
