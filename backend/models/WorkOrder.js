const mongoose = require('mongoose');

const workOrderSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deadline: { type: Date, required: true },
    completedAt: { type: Date }, 
    isOnTime: { type: Boolean }, 
    resources: { type: [String], default: [] },
    customerComments: { type: [String], default: [] },
    internalComments: { type: [String], default: [] },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    predefinedServices: { type: [String], default: [] },
    attachments: { type: [String], default: [] },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
}, { timestamps: true });

const WorkOrder = mongoose.model('WorkOrder', workOrderSchema);
module.exports = WorkOrder;