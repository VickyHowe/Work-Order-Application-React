const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Assigned employee
    deadline: { type: Date, required: true }, // Deadline for the task
    resources: { type: [String], default: [] }, // Equipment/resources needed
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Manager who created the task
    workOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkOrder' }, // Reference to the associated work order
}, { timestamps: true });

const Tasklist = mongoose.model('Tasklist', taskSchema);
module.exports = Tasklist;