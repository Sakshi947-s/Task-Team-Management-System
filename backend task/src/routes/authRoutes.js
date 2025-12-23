const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');

// @route   POST /auth/register
// @desc    Register user
// @access  Public
router.post('/register', signup);

// @route   POST /auth/login
// @desc    Login user
// @access  Public
router.post('/login', login);

module.exports = router;
