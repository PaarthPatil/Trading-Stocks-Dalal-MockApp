/**
 * Team Controller
 * Handles /teams endpoints
 */
const teamService = require('../services/teamService');

/**
 * GET /teams
 * Get all teams
 */
async function getAllTeams(req, res) {
  try {
    const teams = await teamService.getAllTeams();
    
    res.status(200).json({
      success: true,
      data: {
        teams,
        count: teams.length
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
 * GET /teams/:id
 * Get team by ID with members
 */
async function getTeamById(req, res) {
  try {
    const teamId = parseInt(req.params.id);
    
    if (isNaN(teamId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid team ID'
      });
    }
    
    const team = await teamService.getTeamById(teamId);
    
    res.status(200).json({
      success: true,
      data: { team }
    });
  } catch (error) {
    if (error.message === 'Team not found') {
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
 * POST /teams
 * Create a new team (admin only)
 */
async function createTeam(req, res) {
  try {
    const { teamName } = req.body;
    
    if (!teamName) {
      return res.status(400).json({
        success: false,
        error: 'Team name is required'
      });
    }
    
    const team = await teamService.createTeam(teamName);
    
    res.status(201).json({
      success: true,
      data: { team },
      message: 'Team created successfully'
    });
  } catch (error) {
    if (error.message.includes('required')) {
      return res.status(400).json({
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

module.exports = {
  getAllTeams,
  getTeamById,
  createTeam
};
