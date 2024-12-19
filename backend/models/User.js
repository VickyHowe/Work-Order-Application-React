const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  securityQuestion: { type: String, required: true },
  securityQuestionAnswer: { type: String, required: true },
  role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
  userProfile: { type: mongoose.Schema.Types.ObjectId, ref: "UserProfile" },
});
const User = mongoose.model("User ", userSchema);
module.exports = User;
