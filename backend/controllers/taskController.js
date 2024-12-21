const Task = require('../models/Task'); // Import the Task model\
const User = require('../models/User')
const AppError = require('../utils/AppError');

// Get all tasks
exports.getAllTasks = async (req, res, next) => {
    try {
        console.log("Fetching all tasks..."); // Log when the function is called
        const tasks = await Task.find()
            .populate('user', 'username _id role') // Populate only username, _id, and role for user
            .populate('createdBy', 'username _id role'); // Populate only username, _id, and role for createdBy
        console.log("Tasks fetched successfully:", tasks); // Log the fetched tasks
        res.status(200).json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error); // Log the error
        return next(new AppError('Error fetching tasks', 500));
    }
};


// Create a new task
exports.createTask = async (req, res, next) => {
    try {
        const { title, description, deadline, resources, user } = req.body; // Include user
        const newTask = await Task.create({
            title,
            description,
            deadline,
            resources,
            createdBy: req.user._id, // Set the creator to the authenticated user
            user, // Set the assigned user
        });
        res.status(201).json(newTask);
    } catch (error) {
        return next(new AppError('Error creating task', 500));
    }
};

// Update a task
exports.updateTask = async (req, res, next) => {
    try {
        const { title, description, deadline, resources, username } = req.body;
        console.log("Request body:", req.body);

        console.log("Searching for user with username:", username); // Log the username being searched

        // Find the user by username
        const user = await User.findOne({ username });
        console.log("Searching again for user with username:", user); // Log the username being searched
        if (!user) {
            return next(new AppError('User  not found', 404));
        }

        // Update the task with the user ID
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, {
            title,
            description,
            deadline,
            resources,
            user: user._id 
        }, { new: true })
        .select('-password -securityQuestion -securityQuestionAnswer')
        .populate('user', 'username role _id');

        if (!updatedTask) {
            return next(new AppError('Task not found', 404));
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        console.error("Error updating task:", error); // Log the error
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