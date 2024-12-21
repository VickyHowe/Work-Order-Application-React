const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  securityQuestion: { type: String, required: true },
  securityQuestionAnswer: { type: String, required: true },
  role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
  userProfile: { type: mongoose.Schema.Types.ObjectId, ref: "User Profile" },
}, {
  toJSON: {
    transform: function(doc, ret) {
      // Remove sensitive fields
      delete ret.password;
      delete ret.securityQuestion;
      delete ret.securityQuestionAnswer;
      return ret;
    }
  },
  toObject: {
    transform: function(doc, ret) {
      // Remove sensitive fields
      delete ret.password;
      delete ret.securityQuestion;
      delete ret.securityQuestionAnswer;
      return ret;
    }
  }
});

const User = mongoose.model("User ", userSchema);
module.exports = User;