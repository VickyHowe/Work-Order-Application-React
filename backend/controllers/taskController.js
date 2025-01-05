const Task = require("../models/Task");
const User = require("../models/User");
const AppError = require("../utils/AppError");

/**
 * Retrieves all tasks from the database.
 */
exports.getAllTasks = async (req, res, next) => {
  try {
    // Fetch all tasks from the database
    const tasks = await Task.find()
      .populate("user", "username _id role")
      .populate("createdBy", "username _id role");
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error); // Log the error for debugging purposes
    return next(new AppError("Error fetching tasks", 500));
  }
};

/**
 * Creates a new task.
 */
exports.createTask = async (req, res, next) => {
  try {
    // Deconstruct the task data from the request body
    const { title, description, deadline, resources, user, status } = req.body;
    // Create a new task document
    const newTask = await Task.create({
      title,
      description,
      deadline,
      resources,
      createdBy: req.user._id,
      user,
      status: status || "pending",
    });
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error creating task:", error); // Log the error for debugging purposes
    return next(new AppError("Error creating task", 500));
  }
};

/**
 * Updates an existing task.
 */
exports.updateTask = async (req, res, next) => {
  try {
    // Deconstruct the task data from the request body
    const { title, description, deadline, resources, username, status } =
      req.body;
    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Fetch the task to check the current status
    const task = await Task.findById(req.params.id);
    if (!task) {
      return next(new AppError("Task not found", 404));
    }

    // If the task is being marked as completed, completedAt & isOnTime
    if (status === "completed") {
      task.completedAt = new Date();
      task.isOnTime = task.completedAt <= task.deadline;
    }

    // Update the task with the new data
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        deadline,
        resources,
        user: user._id,
        status,
        completedAt: task.completedAt,
        isOnTime: task.isOnTime,
      },
      { new: true }
    ).populate("user", "username role _id");

    if (!updatedTask) {
      return next(new AppError("Task not found", 404));
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error); // Log the error for debugging purposes
    return next(new AppError("Error updating task", 500));
  }
};

/**
 * Deletes a task.
 */
exports.deleteTask = async (req, res, next) => {
  try {
    // Find the user to check if they have permission to delete the task
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return next(new AppError("Task not found", 404));
    }
    res.status(204).send();
  } catch (error) {
    return next(new AppError("Error deleting task", 500));
  }
};
