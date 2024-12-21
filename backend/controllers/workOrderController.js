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

// Update work order with internal comments or status
exports.updateWorkOrder = async (req, res) => {
    const { id } = req.params;
    const { status, internalComments, priority, reminders, predefinedServices, attachments } = req.body;
    try {
        const workOrder = await WorkOrder.findByIdAndUpdate(id, {
            status,
            priority,
            reminders,
            predefinedServices,
            attachments,
            $push: { internalComments: { $each: internalComments } },
        }, { new: true });
        if (!workOrder) return res.status(404).json({ message: 'Work order not found' });
        res.status(200).json({message: 'WorkOrder edited sucessfully', workOrder});
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