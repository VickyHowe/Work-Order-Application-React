const Task = require('../models/Task'); // Import the Task model
const AppError = require('../utils/AppError');

// Get all tasks
exports.getAllTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find().populate('user createdBy'); // Populate user and createdBy fields
        res.status(200).json(tasks);
    } catch (error) {
        return next(new AppError('Error fetching tasks', 500));
    }
};

// Create a new task
exports.createTask = async (req, res, next) => {
    try {
        const { title, description, deadline, resources } = req.body;
        const newTask = await Task.create({
            title,
            description,
            deadline,
            resources,
            createdBy: req.user._id, // Set the creator to the authenticated user
        });
        res.status(201).json(newTask);
    } catch (error) {
        return next(new AppError('Error creating task', 500));
    }
};

// Update a task
exports.updateTask = async (req, res, next) => {
    try {
        const { title, description, deadline, resources } = req.body;
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, {
            title,
            description,
            deadline,
            resources,
        }, { new: true });
        if (!updatedTask) {
            return next(new AppError('Task not found', 404));
        }
        res.status(200).json(updatedTask);
    } catch (error) {
        return next(new AppError('Error updating task', 500));
    }
};

// Delete a task
exports.deleteTask = async (req, res, next) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) {
            return next(new AppError('Task not found', 404));
        }
        res.status(204).send(); // No content
    } catch (error) {
        return next(new AppError('Error deleting task', 500));
    }
};