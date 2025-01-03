const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const workOrderController = require("../../controllers/workOrderController");
const roleCheck = require("../../middleware/roleCheck"); 

router.use(authMiddleware); 

// Creating a new work order request
router
  .route("/request")
  .post(
    roleCheck(["customer", "employee"], "create"),
    workOrderController.createWorkOrderRequest
  ); 

// Update a work order
router
  .route("/:id")
  .put(
    roleCheck(["manager", "employee"], "update"),
    workOrderController.updateWorkOrder
  )  
  // Delete a work order
  .delete(
    roleCheck(["manager", "admin"], "delete"),
    workOrderController.deleteWorkOrder
  );

// Get all work orders
router
  .route("/")
  .get(
    roleCheck(["manager", "admin"], "read"),
    workOrderController.getAllWorkOrdersForManager
  ); 


// Get work orders for the logged-in user
router
  .route("/user")
  .get(
    workOrderController.getWorkOrdersForUser 
  ); 

// Create a new task for a work order
router
  .route("/:workOrderId/tasks")
  .post(
    roleCheck(["admin", "manager", "employee"], "create"), 
    workOrderController.createTaskForWorkOrder
  ); 

// Get all tasks for a work order
router
  .route("/:workOrderId/tasks")
  .get(
    roleCheck(["admin", "manager", "employee"], "read"),
    workOrderController.getTasksForWorkOrder
  ); 

  module.exports = router;
