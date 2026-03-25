/**
 * Team Routes
 */
const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

// Public route - get all teams
router.get('/', teamController.getAllTeams);

// Protected routes
router.get('/:id', teamController.getTeamById);

// Admin only route
router.post('/',
  authenticateToken,
  authorizeAdmin,
  teamController.createTeam
);

module.exports = router;
