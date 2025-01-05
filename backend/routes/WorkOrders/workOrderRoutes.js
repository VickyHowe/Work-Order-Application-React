/**
 * @swagger
 * tags:
 *   name: WorkOrders
 *   description: Workorder Managememnt
 */


const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const workOrderController = require("../../controllers/workOrderController");
const roleCheck = require("../../middleware/roleCheck");

// Apply the auth middleware to all routes
router.use(authMiddleware);

/**
 * @swagger
 * /workorders/request:
 *   post:
 *     summary: Create a new work order request
 *     tags: [WorkOrders]
 *     security:
 *       - bearerAuth: []  
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Work order details
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *               example: "New Work Order"
 *             description:
 *               type: string
 *               example: "Description of the work order."
 *             customerComments:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["Comment 1", "Comment 2"]
 *             priority:
 *               type: string
 *               example: "medium"
 *             reminders:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["Reminder 1"]
 *             predefinedServices:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["Service 1"]
 *             attachments:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["http://example.com/file1.jpg"]
 *             assignedTo:
 *               type: string
 *               example: "60d5ec49f1b2c8b1f8e4e1a2"
 *             deadline:
 *               type: string
 *               format: date-time
 *               example: "2023-12-31T23:59:59Z"
 *             status:
 *               type: string
 *               example: "pending"
 *             internalComments:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["Internal comment 1"]
 *             resources:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["Resource 1"]
 *             tasks:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["Task 1"]
 *     responses:
 *       201:
 *         description: Work order created successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "WorkOrder created successfully!"
 *             workOrder:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60d5ec49f1b2c8b1f8e4e1a1"
 *                 title:
 *                   type: string
 *                   example: "New Work Order"
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: An error occurred while creating the work order
 */
router
  .route("/request")
  .post(
    roleCheck(["customer", "employee"], "create"),
    workOrderController.createWorkOrderRequest
  );

/**
 * @swagger
 * /workorders/{id}:
 *   put:
 *     summary: Update an existing work order
 *     tags: [WorkOrders]
 *     security:
 *       - bearerAuth: []  
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: ID of the work order to update
 *       - in: body
 *         name: body
 *         description: Updated work order details
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *               example: "Updated Work Order Title"
 *             description:
 *               type: string
 *               example: "Updated description of the work order."
 *             deadline:
 *               type: string
 *               format: date-time
 *               example: "2023-12-31T23:59:59Z"
 *             status:
 *               type: string
 *               example: "in progress"
 *     responses:
 *       200:
 *         description: Work order updated successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Work order updated successfully!"
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Work order not found
 *       500:
 *         description: An error occurred while updating the work order
 */
router
  .route("/:id")
  .put(
    roleCheck(["manager", "employee"], "update"),
    workOrderController.updateWorkOrder
  )

  /**
   * @swagger
   * /workorders/{id}:
   *   delete:
   *     summary: Delete a work order
   *     tags: [WorkOrders]
   *     security:
   *       - bearerAuth: []  
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         type: string
   *         description: ID of the work order to delete
   *     responses:
   *       204:
   *         description: Work order deleted successfully
   *       404:
   *         description: Work order not found
   *       500:
   *         description: An error occurred while deleting the work order
   */
  .delete(
    roleCheck(["manager", "admin"], "delete"),
    workOrderController.deleteWorkOrder
  );

/**
 * @swagger
 * /workorders:
 *   get:
 *     summary: Get all work orders
 *     tags: [WorkOrders]
 *     security:
 *       - bearerAuth: []  
 *     responses:
 *       200:
 *         description: A list of work orders
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
 *                 example: "Work Order Title"
 *               status:
 *                 type: string
 *                 example: "pending"
 *       500:
 *         description: An error occurred while retrieving work orders
 */
router
  .route("/")
  .get(
    roleCheck(["manager", "admin"], "view"),
    workOrderController.getAllWorkOrdersForManager
  );

/**
 * @swagger
 * /workorders/user/{id}:
 *   get:
 *     summary: Get work orders for the logged-in user
 *     tags: [WorkOrders]
 *     security:
 *       - bearerAuth: []  
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: ID of the user to retrieve work orders for
 *     responses:
 *       200:
 *         description: A list of work orders for the user
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
 *                 example: "User  Work Order Title"
 *               status:
 *                 type: string
 *                 example: "pending"
 *       404:
 *         description: User not found
 *       500:
 *         description: An error occurred while retrieving work orders for the user
 */
router.route("/user/:id").get(workOrderController.getWorkOrdersForUser);

/**
 * @swagger
 * /workorders/{workOrderId}/tasks:
 *   post:
 *     summary: Create a new task for a work order
 *     tags: [WorkOrders]
 *     security:
 *       - bearerAuth: []  
 *     parameters:
 *       - in: path
 *         name: workOrderId
 *         required: true
 *         type: string
 *         description: ID of the work order to create a task for
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
 *               example: "Description of the task."
 *             assignedTo:
 *               type: string
 *               example: "60d5ec49f1b2c8b1f8e4e1a2"
 *     responses:
 *       201:
 *         description: Task created successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Task created successfully!"
 *             task:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60d5ec49f1b2c8b1f8e4e1a3"
 *                 title:
 *                   type: string
 *                   example: "New Task"
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Work order not found
 *       500:
 *         description: An error occurred while creating the task
 */
router
  .route("/:workOrderId/tasks")
  .post(
    roleCheck(["admin", "manager", "employee"], "create"),
    workOrderController.createTaskForWorkOrder
  );

/**
 * @swagger
 * /workorders/{workOrderId}/tasks:
 *   get:
 *     summary: Get all tasks for a work order
 *     tags: [WorkOrders]
 *     security:
 *       - bearerAuth: [] 
 *     parameters:
 *       - in: path
 *         name: workOrderId
 *         required: true
 *         type: string
 *         description: ID of the work order to retrieve tasks for
 *     responses:
 *       200:
 *         description: A list of tasks for the work order
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 example: "60d5ec49f1b2c8b1f8e4e1a3"
 *               title:
 *                 type: string
 *                 example: "Task Title"
 *               status:
 *                 type: string
 *                 example: "pending"
 *       404:
 *         description: Work order not found
 *       500:
 *         description: An error occurred while retrieving tasks for the work order
 */
router
  .route("/:workOrderId/tasks")
  .get(
    roleCheck(["admin", "manager", "employee"], "read"),
    workOrderController.getTasksForWorkOrder
  );

module.exports = router;
