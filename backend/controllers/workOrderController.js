const WorkOrder = require("../models/WorkOrder");
const Task = require("../models/Task");
const AppError = require("../utils/AppError");

/**
 * Creates a new work order request.
 */
exports.createWorkOrderRequest = async (req, res, next) => {
  const {
    title,
    description,
    customerComments,
    priority,
    reminders,
    predefinedServices,
    attachments,
    assignedTo,
    deadline,
    status,
    internalComments,
    resources,
    tasks,
  } = req.body;

  try {
    // Create the work order
    const workOrder = await WorkOrder.create({
      title,
      description,
      customerComments,
      status: status || "pending",
      createdBy: req.user._id,
      deadline,
      priority: priority || "medium",
      reminders,
      predefinedServices,
      attachments,
      assignedTo: assignedTo || null,
      internalComments: internalComments || [],
      resources: resources || [],
      tasks: tasks || [],
    });
    res
      .status(201)
      .json({ message: "WorkOrder created sucessfully!", workOrder });
  } catch (error) {
    return next(new AppError("Error creating work order request", 500));
  }
};

/**
 * Creates a new task for a work order.
 */
exports.createTaskForWorkOrder = async (req, res, next) => {
  const { title, description, deadline, resources, user, status } = req.body;
  const workOrderId = req.params.workOrderId;

  try {
    // Create the task
    const newTask = await Task.create({
      title,
      description,
      deadline,
      resources,
      createdBy: req.user._id,
      user,
      workOrder: workOrderId,
      status: status || "pending",
    });
    // Add the task to the work order
    await WorkOrder.findByIdAndUpdate(
      workOrderId,
      { $push: { tasks: newTask._id } },
      { new: true }
    );
    res.status(201).json(newTask);
  } catch (error) {
    console.error(error); //log the error
    return next(new AppError("Error creating task for work order", 500));
  }
};

/**
 * Updates an existing work order.
 */
exports.updateWorkOrder = async (req, res, next) => {
  const { id } = req.params;
  const {
    title,
    description,
    deadline,
    status,
    internalComments,
    priority,
    reminders,
    predefinedServices,
    attachments,
    assignedTo,
    resources,
    tasks,
  } = req.body;

  // Validate the request
  if (!title || !description || !deadline) {
    return next(
      new AppError("Please provide title, description, and deadline", 400)
    );
  }

  try {
    // Fetch and check the current status
    const workOrder = await WorkOrder.findById(id);
    if (!workOrder) {
      return next(new AppError("Work order not found", 404));
    }

    // Set onTime?
    if (status === "completed") {
      workOrder.completedAt = new Date();
      workOrder.isOnTime = workOrder.completedAt <= workOrder.deadline;
    }

    // Prepare the update data
    const updateData = {
      title,
      description,
      deadline,
      status: status || workOrder.status,
      priority: priority || workOrder.priority,
      reminders,
      predefinedServices,
      attachments,
      assignedTo: assignedTo || workOrder.assignedTo,
      internalComments: internalComments || workOrder.internalComments,
      resources: resources || workOrder.resources,
      tasks: tasks || workOrder.tasks,
    };

    if (Array.isArray(internalComments)) {
      updateData.$push = { internalComments: { $each: internalComments } };
    }

    // Update the work order
    const updatedWorkOrder = await WorkOrder.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    res.status(200).json({
      message: "WorkOrder edited successfully",
      workOrder: updatedWorkOrder,
    });
  } catch (error) {
    return next(new AppError("Error updating work order", 500));
  }
};

/**
 * Deletes a work order.
 */
exports.deleteWorkOrder = async (req, res, next) => {
  const { id } = req.params;
  try {
    // Delete the work order
    const deletedWorkOrder = await WorkOrder.findByIdAndDelete(id);
    if (!deletedWorkOrder)
      return next(new AppError("Work order not found", 404));
    res.status(200).json({ message: "Work Order was sucessfully Deleted!" });
  } catch (error) {
    return next(new AppError("Error deleting work order", 500));
  }
};

/**
 * Retrieves all tasks associated with a specific work order.
 */
exports.getTasksForWorkOrder = async (req, res, next) => {
  const workOrderId = req.params.workOrderId;

  try {
    // Find all tasks for the work order
    const tasks = await Task.find({ workOrder: workOrderId })
      .populate("user", "username _id role")
      .populate("createdBy", "username _id role");

    res.status(200).json(tasks);
  } catch (error) {
    return next(new AppError("Error fetching tasks for work order", 500));
  }
};

/**
 * Retrieves all work orders for a manager.
 */
exports.getAllWorkOrdersForManager = async (req, res, next) => {
  try {
    // Find all work orders for the manager
    const workOrders = await WorkOrder.find()
      .populate("assignedTo", "user")
      .populate("createdBy", "username");
    res.status(200).json(workOrders);
  } catch (error) {
    return next(new AppError("Error fetching work orders", 500));
  }
};

/**
 * Retrieves all work orders created by the logged-in user.
 */
exports.getWorkOrdersForUser = async (req, res, next) => {
  try {
    const workOrders = await WorkOrder.find({ createdBy: req.user._id })
      .populate("assignedTo", "username")
      .populate("createdBy", "username");
    res.status(200).json(workOrders);
  } catch (error) {
    return next(new AppError("Error fetching work orders", 500));
  }
};
