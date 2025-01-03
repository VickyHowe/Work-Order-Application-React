const WorkOrder = require('../models/WorkOrder');
const Task = require('../models/Task');
const AppError = require('../utils/AppError');

// Create a new work order request from a customer
exports.createWorkOrderRequest = async (req, res) => {
    const { title, description, customerComments, priority, reminders, predefinedServices, attachments } = req.body;
    console.log("Request body:", req.body);
    try {
        const workOrder = await WorkOrder.create({
            title,
            description,
            customerComments,
            status: 'pending',
            createdBy: req.user._id, 
            deadline: req.body.deadline,
            priority,
            reminders,
            predefinedServices,
            attachments
        });
        res.status(201).json({message: 'WorkOrder created sucessfully!', workOrder});
    } catch (error) {
        return next(new AppError('Error creating work order request', 500));
    }
};

// Create a new task for work order
exports.createTaskForWorkOrder = async (req, res, next) => {
    const { title, description, deadline, resources, user, status } = req.body;
    const workOrderId = req.params.workOrderId;

    try {
        const newTask = await Task.create({
            title,
            description,
            deadline,
            resources,
            createdBy: req.user._id,
            user,
            workOrder: workOrderId,
            status: status || 'pending'
        });

        const updatedWorkOrder = await WorkOrder.findByIdAndUpdate(
            workOrderId,
            { $push: { tasks: newTask._id } },
            { new: true } 
        );
        res.status(201).json(newTask);
    } catch (error) {
        console.error(error); 
        return next(new AppError('Error creating task for work order', 500));
    }
};

// Update work order
exports.updateWorkOrder = async (req, res) => {
    const { id } = req.params;
    const { status, internalComments, priority, reminders, predefinedServices, attachments } = req.body;

    try {
        // Fetch and check the current status
        const workOrder = await WorkOrder.findById(id);
        if (!workOrder) {
            return next(new AppError('Work order not found', 404));
        }

        // Set onTime?
        if (status === 'completed') {
            workOrder.completedAt = new Date(); 
            workOrder.isOnTime = workOrder.completedAt <= workOrder.deadline; 
        }

        // Prepare the update data
        const updateData = {
            status,
            priority,
            reminders,
            predefinedServices,
            attachments,
            completedAt: workOrder.completedAt, 
            isOnTime: workOrder.isOnTime 
        };

        if (Array.isArray(internalComments)) {
            updateData.$push = { internalComments: { $each: internalComments } };
        }

        // Update the work order
        const updatedWorkOrder = await WorkOrder.findByIdAndUpdate(id, updateData, { new: true });
        res.status(200).json({ message: 'WorkOrder edited successfully', workOrder: updatedWorkOrder });
    } catch (error) {
        return next(new AppError('Error updating work order', 500));
    }
};

// Delete a work order (accessible by managers and admins)
exports.deleteWorkOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedWorkOrder = await WorkOrder.findByIdAndDelete(id);
        if (!deletedWorkOrder) 
            return next(new AppError('Work order not found', 404));
        res.status(200).json({message: 'Work Order was sucessfully Deleted!'}); 
    } catch (error) {
        return next(new AppError('Error deleting work order', 500));
    }
};

// Get all tasks for work Orders
exports.getTasksForWorkOrder = async (req, res, next) => {
    const workOrderId = req.params.workOrderId;

    try {
        const tasks = await Task.find({ workOrder: workOrderId })
            .populate('user', 'username _id role')
            .populate('createdBy', 'username _id role');

        res.status(200).json(tasks);
    } catch (error) {
        return next(new AppError('Error fetching tasks for work order', 500));
    }
};

// Get all work orders for a manager
exports.getAllWorkOrdersForManager = async (req, res) => {
    try {
        const workOrders = await WorkOrder.find()
            .populate('assignedTo', 'username')
            .populate('createdBy', 'username'); 
        res.status(200).json(workOrders);
    } catch (error) {
        return next(new AppError('Error fetching work orders', 500));
    }
};

// Get all work orders for the logged-in user
exports.getWorkOrdersForUser  = async (req, res) => {
    try {
        const workOrders = await WorkOrder.find({ createdBy: req.user._id }) 
            .populate('assignedTo', 'username')
            .populate('createdBy', 'username');
        res.status(200).json(workOrders);
    } catch (error) {
        return next(new AppError('Error fetching work orders', 500));
    }
};