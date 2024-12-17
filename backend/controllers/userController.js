const User = require("../models/User");
const UserProfile = require('../models/UserProfile');
const bcrypt = require("bcryptjs");
const { generateToken } = require('../utils/tokenGenerator'); 
const AppError = require('../utils/AppError');

// Request Password Reset using Security Questions
exports.requestPasswordReset = async (req, res) => {
    const { username } = req.body; 
  
    try {
        console.log(`Requesting password reset for username: ${username}`);
        const user = await User.findOne({ username });
        if (!user) {
            console.error(`User  not found for username: ${username}`);
            return res.status(404).json({ message: "User  not found" });
        }

        return res.status(200).json({
            securityQuestion: user.securityQuestion 
        });
    } catch (error) {
        console.error(`Error requesting password reset for username: ${username}`, error);
        return res.status(500).json({ message: "An error occurred while requesting password reset" });
    }
};

// Verify Security Question Answer
exports.verifySecurityQuestion = async (req, res) => {
    const { username, securityQuestionAnswer } = req.body; 
  
    try {
        console.log(`Verifying security question for username: ${username}`);
        const user = await User.findOne({ username });
        if (!user) {
            console.error(`User  not found for username: ${username}`);
            return res.status(404).json({ message: "User  not found" });
        }
  
        // Verify the answer to the security question
        const isMatch = await bcrypt.compare(securityQuestionAnswer, user.securityQuestionAnswer);
        if (!isMatch) {
            console.error(`Incorrect answer for user: ${username}`);
            return res.status(400).json({ message: "Incorrect answer to security question" });
        }
  
        // If the answer is correct, allow the user to set a new password
        const token = generateToken(user._id); 
        console.log(`Token generated for user: ${username}, Token: ${token}`);
        
        return res.status(200).json({
            message: "Security question answered correctly. You can now reset your password.",
            token,
        });
    } catch (error) {
        console.error(`Error verifying security question answer for username: ${username}`, error);
        return res.status(500).json({ message: "An error occurred while verifying the security question answer" });
    }
};


// Reset Password using Token
exports.resetPasswordWithToken = async (req, res) => {
    const { newPassword } = req.body;
  
    // Validate input
    if (!newPassword) {
        console.error("New password is required");
        return res.status(400).json({ message: "New password is required" });
    }
  
    try {
        
        const user = req.user;

        if (!user) {
            console.error("User  not found in request after token verification");
            return res.status(401).json({ message: "Invalid token" });
        }
  
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
  
        console.log(`Password reset successfully for user: ${user.username}`);
        return res.status(200).json({ message: "Password has been reset successfully" });
    } catch (error) {
        console.error(`Error resetting password for user: ${user ? user.username : 'unknown'}`, error);
        return res.status(500).json({ message: "An error occurred while resetting the password" });
    }
};

// Change/Reset User Password
exports.changeUserPassword = async (req, res) => {
  const { userId, newPassword } = req.body;

  // Validate input
  if (!userId || !newPassword) {
    return res
      .status(400)
      .json({ message: "User  ID and new password are required" });
  }

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User  not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while changing the password" });
  }
};

// Update User Role
exports.update = async (req, res) => {
  const { roleId, userId } = req.body;
  if (!roleId || !userId) {
    return res
      .status(400)
      .json({ message: "Role ID and User ID must be provided" });
  }

  try {

    const userToUpdate = await User.findById(userId).populate("role");

    // Check if user exists
    if (!userToUpdate) {
      return res.status(404).json({ message: "User  not found" });
    }

    const requester = req.user;

    // Ensure requester has a role
    if (!requester.role) {
      return res
        .status(403)
        .json({ message: "Requester has no role assigned" });
    }

    // Ensure canAssign is an array
    if (!Array.isArray(requester.role.canAssign)) {
      return res
        .status(500)
        .json({ message: "Requester role's canAssign is not an array" });
    }

    // Find the role to assign
    const roleToAssign = await Role.findById(roleId);

    if (!roleToAssign) {
      return res.status(404).json({ message: "Role not found" });
    }

    // Check if the requester's role can assign the new role
    if (!requester.role.canAssign.includes(roleToAssign.name)) {
      return res
        .status(403)
        .json({ message: "You do not have permission to assign this role" });
    }

    // Update the user's role
    userToUpdate.role = roleId;
    await userToUpdate.save();

    return res
      .status(200)
      .json({
        message: "Update successful",
        user: { id: userToUpdate._id, role: roleToAssign.name },
      });
  } catch (error) {
    console.error("Error updating user:", error);
    return res
      .status(500)
      .json({ message: "An internal server error occurred" });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "User  ID must be provided" });
  }

  try {
    const result = await User.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "User  not found" });
    }

    return res.status(200).json({ message: "User  successfully deleted" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "An error occurred", error: error.message });
  }
};

exports.updateProfile = async (req, res, next) => {
  const { firstName, lastName, phoneNumber, address, city, province, postalCode } = req.body;

  try {
      // Attempt to find and update the user profile
      const profile = await UserProfile.findOneAndUpdate(
          { user: req.user.id }, 
          { firstName, lastName, phoneNumber, address, city, province, postalCode },
          { new: true, upsert: true, runValidators: true } 
      );

      // If no profile is found, throw a 404 error
      if (!profile) {
          return next(new AppError('Profile not found', 404));
      }

      // Return success response with the updated profile
      return res.status(200).json({
          status: 'success',
          message: "Profile updated successfully",
          data: {
              profile 
          }
      });
  } catch (error) {
      // Handle validation errors specifically
      if (error.name === 'ValidationError') {
          return next(new AppError(error.message, 400)); 
      }
      // Handle other errors
      return next(new AppError("An error occurred while updating the profile", 500));
  }
};

// Get user profile
exports.getProfile = async (req, res, next) => {
  try {
      const profile = await UserProfile.findOne({ user: req.user.id });
      if (!profile) {
          return next(new AppError("Profile not found", 404));
      }

      return res.status(200).json(profile);
  } catch (error) {
      return next(new AppError("An error occurred while retrieving the profile", 500));
  }
};