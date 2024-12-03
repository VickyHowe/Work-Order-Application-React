const mongoose = require("mongoose");

const workOrderHistorySchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User Profile'
    },
    workOrderDate: {
        type: Date, 
        default: Date.now 
    },
    description: { 
        type: String 
    },
    status: { 
        type: String 
    }
});

const WorkOrderHistory = mongoose.model('WorkOrderHistory', workOrderHistorySchema);

module.exports = WorkOrderHistory;