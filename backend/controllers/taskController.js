const Task = require('../models/Task');

exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id }); // Fetch tasks for the authenticated user
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks' });
    }
};

exports.createTask = async (req, res) => {
    const { title, description } = req.body;
    try {
        const newTask = await Task.create({ title, description, user: req.user.id });
        res.status(201).json(newTask);
    } catch (error) {
        res.status(400).json({ message: 'Error creating task' });
    }
};

exports.updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;
    try {
        const updatedTask = await Task.findByIdAndUpdate(id, { title, description, status }, { new: true });
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: 'Error updating task' });
    }
};

exports.deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        await Task.findByIdAndDelete(id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: 'Error deleting task' });
    }
};