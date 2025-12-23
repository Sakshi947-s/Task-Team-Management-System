const Team = require('../models/Team');
const Task = require('../models/Task');

// @desc    Create a new team
// @route   POST /teams
// @access  Private (Admin, Manager)
exports.createTeam = async (req, res) => {
    try {
        const { name } = req.body;

        const team = new Team({
            name,
            createdBy: req.user.id
        });

        await team.save();
        res.json(team);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get all teams
// @route   GET /teams
// @access  Private
exports.getTeams = async (req, res) => {
    try {
        const teams = await Team.find().populate('createdBy', 'name email');
        res.json(teams);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
// @desc    Delete a team
// @route   DELETE /teams/:id
// @access  Private (Admin, Manager)
exports.deleteTeam = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({ msg: 'Team not found' });
        }

        // Delete all tasks associated with this team
        await Task.deleteMany({ team: req.params.id });

        // Delete the team itself
        await Team.deleteOne({ _id: req.params.id });

        res.json({ msg: 'Team and associated tasks removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Team not found' });
        }
        res.status(500).send('Server Error');
    }
};
