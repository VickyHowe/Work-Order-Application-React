const WorkOrder = require('../models/WorkOrder');

// Create a new work order request from a customer
exports.createWorkOrderRequest = async (req, res) => {
    const { title, description, customerComments, priority, reminders, predefinedServices, attachments } = req.body;
    try {
        const workOrder = await WorkOrder.create({
            title,
            description,
            customerComments,
            status: 'pending',
            createdBy: req.user._id, // Assuming req.user is set by auth middleware
            deadline: req.body.deadline,
            priority,
            reminders,
            predefinedServices,
            attachments
        });
        res.status(201).json({message: 'WorkOrder created sucessfully!', workOrder});
    } catch (error) {
        res.status(500).json({ message: 'Error creating work order request', error: error.message });
    }
};
exports.createTaskForWorkOrder = async (req, res) => {
    const { title, description, deadline, resources, user } = req.body;
    const workOrderId = req.params.workOrderId; // Get the work order ID from the request parameters

    try {
        const newTask = await Task.create({
            title,
            description,
            deadline,
            resources,
            createdBy: req.user._id, // Set the creator to the authenticated user
            user, // Set the assigned user
            workOrder: workOrderId // Associate the task with the work order
        });

        // Add the task ID to the work order
        await WorkOrder.findByIdAndUpdate(workOrderId, {
            $push: { tasks: newTask._id }
        });

        res.status(201).json(newTask);
    } catch (error) {
        return next(new AppError('Error creating task for work order', 500));
    }
};

// Update work order with internal comments or status
exports.updateWorkOrder = async (req, res) => {
    const { id } = req.params;
    const { status, internalComments, priority, reminders, predefinedServices, attachments } = req.body;

    // Prepare the update object
    const updateData = {
        status,
        priority,
        reminders,
        predefinedServices,
        attachments,
    };

    // Only add internalComments to the update if it is an array
    if (Array.isArray(internalComments)) {
        updateData.$push = { internalComments: { $each: internalComments } };
    }

    try {
        const workOrder = await WorkOrder.findByIdAndUpdate(id, updateData, { new: true });
        if (!workOrder) return res.status(404).json({ message: 'Work order not found' });
        res.status(200).json({ message: 'WorkOrder edited successfully', workOrder });
    } catch (error) {
        res.status(500).json({ message: 'Error updating work order', error: error.message });
    }
};

// Delete a work order (accessible by managers and admins)
exports.deleteWorkOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedWorkOrder = await WorkOrder.findByIdAndDelete(id);
        if (!deletedWorkOrder) return res.status(404).json({ message: 'Work order not found' });
        res.status(200).json({message: 'Work Order was sucessfully Deleted!'}); 
    } catch (error) {
        res.status(500).json({ message: 'Error deleting work order', error: error.message });
    }
};
exports.getTasksForWorkOrder = async (req, res) => {
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
        res.status(500).json({ message: 'Error fetching work orders', error: error.message });
    }
};

// Get all work orders for the logged-in user
exports.getWorkOrdersForUser  = async (req, res) => {
    try {
        const workOrders = await WorkOrder.find({ createdBy: req.user._id }) // Adjust based on your logic
            .populate('assignedTo', 'username')
            .populate('createdBy', 'username');
        res.status(200).json(workOrders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching work orders', error: error.message });
    }
};