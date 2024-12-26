const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const workOrderController = require("../../controllers/workOrderController");
const roleCheck = require("../../middleware/roleCheck"); // Import the roleCheck middleware

router.use(authMiddleware); // Protect all routes

// Route for creating a new work order request (accessible by customers and employees)
router
  .route("/request")
  .post(
    roleCheck(["customer", "employee"], "create"),
    workOrderController.createWorkOrderRequest
  ); // Create a new work order request

// Route for updating a work order (accessible by managers and employees)
router
  .route("/:id")
  .put(
    roleCheck(["manager", "employee"], "update"),
    workOrderController.updateWorkOrder
  ) // Update a work order
  .delete(
    roleCheck(["manager", "admin"], "delete"),
    workOrderController.deleteWorkOrder
  ); // Delete a work order

// Route for getting all work orders (accessible by managers)
router
  .route("/")
  .get(
    roleCheck(["manager"], "read"),
    workOrderController.getAllWorkOrdersForManager
  ); // Get all work orders for managers


// Route for getting work orders for the logged-in user
router
  .route("/user")
  .get(
    authMiddleware,
    workOrderController.getWorkOrdersForUser 
  ); // Get work orders for the logged-in user

// New route for creating a task for a specific work order
router
  .route("/:workOrderId/tasks")
  .post(
    roleCheck(["manager", "employee"], "create"), // Adjust roles as necessary
    workOrderController.createTaskForWorkOrder
  ); // Create a new task for a work order

// New route for getting all tasks for a specific work order
router
  .route("/:workOrderId/tasks")
  .get(
    roleCheck(["manager", "employee"], "read"), // Adjust roles as necessary
    workOrderController.getTasksForWorkOrder
  ); // Get all tasks for a work order


  module.exports = router;
