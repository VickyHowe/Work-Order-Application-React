const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User Profile' },
    startTime: { type: Date },
    endTime: { type: Date },
    eventDescription: { type: String }
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;