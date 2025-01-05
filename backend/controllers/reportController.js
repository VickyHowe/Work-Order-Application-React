const WorkOrder = require("../models/WorkOrder");
const Task = require("../models/Task");
const AppError = require("../utils/AppError");

/**
 * Retrieves report data for work orders and tasks.
 */
const getReportData = async (req, res) => {
  try {
    // Fetch all work orders and tasks
    const workOrders = await WorkOrder.find();
    const tasks = await Task.find();

    // Work Order Metrics
    const workOrdersByStatus = {
      pending: workOrders.filter((order) => order.status === "pending").length,
      inProgress: workOrders.filter((order) => order.status === "in-progress")
        .length,
      completed: workOrders.filter((order) => order.status === "completed")
        .length,
    };

    const workOrdersByPriority = {
      low: workOrders.filter((order) => order.priority === "low").length,
      medium: workOrders.filter((order) => order.priority === "medium").length,
      high: workOrders.filter((order) => order.priority === "high").length,
    };

    const completedWorkOrders = workOrders.filter(
      (order) => order.status === "completed"
    );

    const totalTime = completedWorkOrders.reduce((sum, order) => {
      const start = new Date(order.createdAt);
      const end = new Date(order.updatedAt);
      return sum + (end - start);
    }, 0);
    const averageTimeToComplete =
      completedWorkOrders.length > 0
        ? totalTime / completedWorkOrders.length
        : 0;

    const workOrdersByUser = {};
    workOrders.forEach((order) => {
      const userId = order.assignedTo
        ? order.assignedTo.toString()
        : "Unassigned";
      workOrdersByUser[userId] = (workOrdersByUser[userId] || 0) + 1;
    });

    // Task Metrics
    const tasksByStatus = {
      pending: tasks.filter((task) => task.status === "pending").length,
      inProgress: tasks.filter((task) => task.status === "in-progress").length,
      completed: tasks.filter((task) => task.status === "completed").length,
    };

    const completedTasks = tasks.filter((task) => task.status === "completed");
    const totalTaskTime = completedTasks.reduce((sum, task) => {
      const start = new Date(task.createdAt);
      const end = new Date(task.updatedAt);
      return sum + (end - start);
    }, 0);
    const averageTimeToCompleteTasks =
      completedTasks.length > 0 ? totalTaskTime / completedTasks.length : 0;

    const tasksByUser = {};
    tasks.forEach((task) => {
      const userId = task.user ? task.user.toString() : "Unassigned";
      tasksByUser[userId] = (tasksByUser[userId] || 0) + 1;
    });

    // Combined Metrics
    const allResources = [
      ...new Set([
        ...workOrders.flatMap((order) => order.resources),
        ...tasks.flatMap((task) => task.resources),
      ]),
    ];
    const totalResources = allResources.length;

    const totalCustomerComments = workOrders.reduce(
      (sum, order) => sum + order.customerComments.length,
      0
    );
    const totalInternalComments = workOrders.reduce(
      (sum, order) => sum + order.internalComments.length,
      0
    );
    const totalAttachments = workOrders.reduce(
      (sum, order) => sum + order.attachments.length,
      0
    );

    // Calculate Percentages
    const totalWorkOrders = workOrders.length;
    const totalTasks = tasks.length;

    const completedWorkOrdersPercentage =
      totalWorkOrders > 0
        ? ((completedWorkOrders.length / totalWorkOrders) * 100).toFixed(2)
        : 0;

    const completedTasksPercentage =
      totalTasks > 0
        ? ((completedTasks.length / totalTasks) * 100).toFixed(2)
        : 0;

    // Report Data
    const reportData = {
      totalWorkOrders,
      completedWorkOrders: completedWorkOrders.length,
      completedWorkOrdersPercentage,
      pendingTasks: tasksByStatus.pending,
      workOrdersByStatus,
      workOrdersByPriority,
      averageTimeToComplete,
      workOrdersByUser,
      tasksByStatus,
      averageTimeToCompleteTasks,
      tasksByUser,
      totalResources,
      totalCustomerComments,
      totalInternalComments,
      totalAttachments,
      completedTasks: completedTasks.length,
      completedTasksPercentage,
    };

    res.status(200).json(reportData);
  } catch (error) {
    return next(new AppError("Error fetching report data", 500));
  }
};

module.exports = {
  getReportData,
};
