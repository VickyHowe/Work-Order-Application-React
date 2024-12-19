const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User ' }, // Reference to the user who created the task
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;