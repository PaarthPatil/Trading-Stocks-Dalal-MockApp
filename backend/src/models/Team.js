/**
 * Team Model
 * Database operations for teams
 */
const db = require('../config/database');

/**
 * Create a new team
 * @param {string} teamName - Team name
 * @returns {Promise<object>} Created team
 */
async function createTeam(teamName) {
  const sql = 'INSERT INTO teams (team_name) VALUES (?)';
  const result = await db.query(sql, [teamName]);
  
  return getTeamById(result.insertId);
}

/**
 * Get team by ID
 * @param {number} id - Team ID
 * @returns {Promise<object|null>} Team or null
 */
async function getTeamById(id) {
  const sql = 'SELECT * FROM teams WHERE id = ?';
  const rows = await db.query(sql, [id]);
  
  return rows[0] || null;
}

/**
 * Get all teams
 * @returns {Promise<array>} Array of teams
 */
async function getAllTeams() {
  const sql = `
    SELECT 
      t.id,
      t.team_name,
      t.created_at,
      COUNT(u.id) as member_count,
      SUM(u.balance) as total_balance
    FROM teams t
    LEFT JOIN users u ON t.id = u.team_id
    GROUP BY t.id, t.team_name, t.created_at
    ORDER BY total_balance DESC
  `;
  
  return await db.query(sql);
}

/**
 * Update team name
 * @param {number} teamId - Team ID
 * @param {string} newName - New team name
 * @returns {Promise<object>} Updated team
 */
async function updateTeamName(teamId, newName) {
  const sql = 'UPDATE teams SET team_name = ? WHERE id = ?';
  await db.query(sql, [newName, teamId]);
  
  return getTeamById(teamId);
}

module.exports = {
  createTeam,
  getTeamById,
  getAllTeams,
  updateTeamName
};
