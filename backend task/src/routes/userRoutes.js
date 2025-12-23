const express = require('express');
const router = express.Router();
const { getUsers } = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

// @route   GET /users
// @desc    Get all users
// @access  Private
router.get('/', auth, getUsers);

module.exports = router;
