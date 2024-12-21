const express = require('express');
const authMiddleware = require('../../middleware/authMiddleware');
const roleCheck = require('../../middleware/roleCheck');
const taskController = require('../../controllers/taskController');
const pricelistController = require('../../controllers/pricelistController');

const router = express.Router();

// Task routes
router.use(authMiddleware);
router.route('/')
    .get(taskController.getAllTasks) // Get all tasks
    .post(roleCheck(['manager', 'admin'], 'create'), taskController.createTask); // Create a new task

router.route('/:id')
    .put(roleCheck(['manager', 'admin'], 'update'), taskController.updateTask) // Update a task
    .delete(roleCheck(['manager', 'admin'], 'delete'), taskController.deleteTask); // Delete a task


module.exports = router;