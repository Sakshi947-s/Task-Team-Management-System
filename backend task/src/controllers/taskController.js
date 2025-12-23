const Task = require('../models/Task');

// Create a new task
exports.createTask = async (req, res) => {
    try {
        const { title, description, status, priority, dueDate, assignedTo, teamId } = req.body;

        const task = new Task({
            title,
            description,
            status,
            priority,
            dueDate,
            assignedTo,
            team: teamId, // Assuming teamId is passed in body
            createdBy: req.user.id // Assuming auth middleware sets req.user
        });

        const savedTask = await task.save();
        res.status(201).json(savedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all tasks (can filter by team)
exports.getTasks = async (req, res) => {
    try {
        const { teamId } = req.query;
        let query = {};
        if (teamId) {
            query.team = teamId;
        }

        const tasks = await Task.find(query).populate('assignedTo', 'name email').populate('createdBy', 'name');
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a task
exports.updateTask = async (req, res) => {
    try {
        const { title, description, status, priority, dueDate, assignedTo } = req.body;

        let task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Add authorization check here if needed (e.g. only creator or team member)

        task.title = title || task.title;
        task.description = description || task.description;
        task.status = status || task.status;
        task.priority = priority || task.priority;
        task.dueDate = dueDate || task.dueDate;
        task.assignedTo = assignedTo || task.assignedTo;

        const updatedTask = await task.save();
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a task
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await task.deleteOne();
        res.status(200).json({ message: 'Task removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
