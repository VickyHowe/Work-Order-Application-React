const mongoose = require("mongoose");

const notificationsSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        index: true
    },
    notificationDate: { 
        type: Date, 
        default: Date.now 
    },
    message: { 
        type: String 
    },
    isRead: { 
        type: Boolean, 
        default: false 
    }
});

const Notifications = mongoose.model('Notifications', notificationsSchema);

module.exports = Notifications;