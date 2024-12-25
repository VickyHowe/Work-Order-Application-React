const mongoose = require('mongoose');

const workOrderSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the User model
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the User model for the creator
    deadline: { type: Date, required: true },
    resources: { type: [String], default: [] }, // Array of resources needed
    customerComments: { type: [String], default: [] }, // Array of customer comments
    internalComments: { type: [String], default: [] }, // Array of internal comments
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' }, // Task priority
    predefinedServices: { type: [String], default: [] }, // Array of predefined services
    attachments: { type: [String], default: [] }, // Array of file paths for attachments
}, { timestamps: true });

const WorkOrder = mongoose.model('WorkOrder', workOrderSchema);
module.exports = WorkOrder;