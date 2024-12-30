const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    deadline: { type: Date, required: true }, 
    resources: { type: [String], default: [] }, 
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    workOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkOrder' }, 
}, { timestamps: true });

const Tasklist = mongoose.model('Tasklist', taskSchema);
module.exports = Tasklist;