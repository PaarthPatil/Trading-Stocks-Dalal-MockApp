/**
 * Team Service
 * Business logic for team operations
 */
const Team = require('../models/Team');
const User = require('../models/User');

/**
 * Get all teams with statistics
 * @returns {Promise<array>} Array of teams
 */
async function getAllTeams() {
  const teams = await Team.getAllTeams();
  
  return teams.map(team => ({
    id: team.id,
    teamName: team.team_name,
    memberCount: parseInt(team.member_count) || 0,
    totalBalance: parseFloat(team.total_balance) || 0,
    createdAt: team.created_at
  }));
}

/**
 * Get team by ID with members
 * @param {number} teamId - Team ID
 * @returns {Promise<object>} Team with members
 */
async function getTeamById(teamId) {
  const team = await Team.getTeamById(teamId);
  
  if (!team) {
    throw new Error('Team not found');
  }
  
  // Get team members
  const members = await User.getUsersByTeamId(teamId);
  
  return {
    id: team.id,
    teamName: team.team_name,
    createdAt: team.created_at,
    members: members.map(member => ({
      id: member.id,
      name: member.name,
      email: member.email,
      balance: parseFloat(member.balance),
      isAdmin: member.is_admin === 1,
      createdAt: member.created_at
    }))
  };
}

/**
 * Create a new team
 * @param {string} teamName - Team name
 * @returns {Promise<object>} Created team
 */
async function createTeam(teamName) {
  if (!teamName || typeof teamName !== 'string') {
    throw new Error('Team name is required and must be a string');
  }
  
  const createdTeam = await Team.createTeam(teamName);
  
  return {
    id: createdTeam.id,
    teamName: createdTeam.team_name,
    createdAt: createdTeam.created_at
  };
}

module.exports = {
  getAllTeams,
  getTeamById,
  createTeam
};
