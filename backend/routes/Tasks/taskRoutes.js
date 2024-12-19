const express = require('express');
const authMiddleware = require('../../middleware/authMiddleware');
const taskController = require('../../controllers/taskController');

const router = express.Router();

router.use(authMiddleware); // Protect all routes with authentication

router.route('/')
    .get(taskController.getAllTasks) // Get all tasks
    .post(taskController.createTask); // Create a new task

router.route('/:id')
    .put(taskController.updateTask) // Update a task
    .delete(taskController.deleteTask); // Delete a task

module.exports = router;