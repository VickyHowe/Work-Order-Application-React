const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    securityQuestion: { type: String, required: true }, // e.g., "What is your mother's maiden name?"
    securityQuestionAnswer: { type: String, required: true }, // Store hashed answer for security
});

const User = mongoose.model("User ", userSchema);
module.exports = User;