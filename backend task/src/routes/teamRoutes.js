const express = require('express');
const router = express.Router();
const { createTeam, getTeams, deleteTeam } = require('../controllers/teamController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// @route   POST /teams
// @desc    Create a team
// @access  Private (Admin, Manager)
router.post('/', authMiddleware, roleMiddleware(['admin', 'manager']), createTeam);

// @route   GET /teams
// @desc    Get all teams
// @access  Private
router.get('/', authMiddleware, getTeams);

// @route   DELETE /teams/:id
// @desc    Delete a team
// @access  Private (Admin, Manager)
router.delete('/:id', authMiddleware, roleMiddleware(['admin', 'manager']), deleteTeam);

module.exports = router;
