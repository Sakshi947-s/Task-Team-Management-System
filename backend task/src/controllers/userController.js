const User = require('../models/User');

// @desc    Get all users
// @route   GET /users
// @access  Private
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
