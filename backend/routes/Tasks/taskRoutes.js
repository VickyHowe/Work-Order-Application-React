/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task Management
 */

const express = require("express");
const authMiddleware = require("../../middleware/authMiddleware");
const roleCheck = require("../../middleware/roleCheck");
const taskController = require("../../controllers/taskController");

const router = express.Router();

// Middleware to protect routes
router.use(authMiddleware);

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of tasks
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 example: "60d5ec49f1b2c8b1f8e4e1a1"
 *               title:
 *                 type: string
 *                 example: "Task Title"
 *               description:
 *                 type: string
 *                 example: "Task Description"
 *               status:
 *                 type: string
 *                 enum: ["pending", "in-progress", "completed"]
 *                 example: "pending"
 *               user:
 *                 type: string
 *                 example: "60d5ec49f1b2c8b1f8e4e1a2"
 *               deadline:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-12-31T23:59:59Z"
 *               createdBy:
 *                 type: string
 *                 example: "60d5ec49f1b2c8b1f8e4e1a3"
 *       500:
 *         description: An error occurred while fetching tasks
 */
router.route("/").get(taskController.getAllTasks);

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Task details
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *               example: "New Task"
 *             description:
 *               type: string
 *               example: "Description of the new task."
 *             deadline:
 *               type: string
 *               format: date-time
 *               example: "2023-12-31T23:59:59Z"
 *             resources:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["resource1", "resource2"]
 *             user:
 *               type: string
 *               example: "60d5ec49f1b2c8b1f8e4e1a2"
 *             status:
 *               type: string
 *               example: "pending"
 *     responses:
 *       201:
 *         description: Task created successfully
 *         schema:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: "60d5ec49f1b2c8b1f8e4e1a1"
 *             title:
 *               type: string
 *               example: "New Task"
 *             description:
 *               type: string
 *               example: "Description of the new task."
 *             status:
 *               type: string
 *               example: "pending"
 *             user:
 *               type: string
 *               example: "60d5ec49f1b2c8b1f8e4e1a2"
 *             createdBy:
 *               type: string
 *               example: "60d5ec49f1b2c8b1f8e4e1a3"
 *       403:
 *         description: You do not have permission to perform this action
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: An error occurred while creating the task
 */
router
  .route("/")
  .post(roleCheck(["manager", "admin"], "create"), taskController.createTask);
/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update an existing task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: The ID of the task to update
 *       - in: body
 *         name: body
 *         description: Updated task details
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *               example: "Updated Task Title"
 *             description:
 *               type: string
 *               example: "Updated description of the task."
 *             deadline:
 *               type: string
 *               format: date-time
 *               example: "2023-12-31T23:59:59Z"
 *             resources:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["updatedResource1", "updatedResource2"]
 *             username:
 *               type: string
 *               example: "user123"
 *             status:
 *               type: string
 *               example: "completed"
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         schema:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: "60d5ec49f1b2c8b1f8e4e1a1"
 *             title:
 *               type: string
 *               example: "Updated Task Title"
 *             description:
 *               type: string
 *               example: "Updated description of the task."
 *             status:
 *               type: string
 *               example: "completed"
 *             user:
 *               type: string
 *               example: "60d5ec49f1b2c8b1f8e4e1a2"
 *             createdBy:
 *               type: string
 *               example: "60d5ec49f1b2c8b1f8e4e1a3"
 *       404:
 *         description: Task not found
 *       403:
 *         description: You do not have permission to perform this action
 *       500:
 *         description: An error occurred while updating the task
 */
router
  .route("/:id")
  .put(roleCheck(["manager", "admin"], "update"), taskController.updateTask);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: The ID of the task to delete
 *     responses:
 *       204:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 *       403:
 *         description: You do not have permission to perform this action
 *       500:
 *         description: An error occurred while deleting the task
 */
router
  .route("/:id")
  .delete(roleCheck(["manager", "admin"], "delete"), taskController.deleteTask);

module.exports = router;
