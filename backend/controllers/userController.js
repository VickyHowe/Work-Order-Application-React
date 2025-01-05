const User = require("../models/User");
const UserProfile = require("../models/UserProfile");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/tokenGenerator");
const AppError = require("../utils/AppError");

const handleError = (res, error, message, statusCode = 500) => {
  console.error(message, error);
  return res.status(statusCode).json({ message });
};

// Request Password Reset using Security Questions
exports.requestPasswordReset = async (req, res) => {
  const { username } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return handleError(res, null, "User  not found", 404);
    return res.status(200).json({ securityQuestion: user.securityQuestion });
  } catch (error) {
    return handleError(
      res,
      error,
      "An error occurred while requesting password reset"
    );
  }
};

// Verify Security Question Answer
exports.verifySecurityQuestion = async (req, res) => {
  const { username, securityQuestionAnswer } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return handleError(res, null, "User  not found", 404);

    const isMatch = await bcrypt.compare(
      securityQuestionAnswer,
      user.securityQuestionAnswer
    );
    if (!isMatch)
      return handleError(
        res,
        null,
        "Incorrect answer to security question",
        400
      );

    const token = generateToken(user._id);
    return res
      .status(200)
      .json({
        message:
          "Security question answered correctly. You can now reset your password.",
        token,
      });
  } catch (error) {
    return handleError(
      res,
      error,
      "An error occurred while verifying the security question answer"
    );
  }
};

// Reset Password using Token
exports.resetPasswordWithToken = async (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword)
    return handleError(res, null, "New password is required", 400);

  try {
    const user = req.user;
    if (!user) return handleError(res, null, "Invalid token", 401);

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return res
      .status(200)
      .json({ message: "Password has been reset successfully" });
  } catch (error) {
    return handleError(
      res,
      error,
      "An error occurred while resetting the password"
    );
  }
};

// Update User Role
exports.updateUserRole = async (req, res) => {
  const { roleId } = req.body;
  const { id } = req.params;

  if (!roleId) return handleError(res, null, "Role ID must be provided", 400);

  try {
    const user = await User.findById(id);
    if (!user) return handleError(res, null, "User  not found", 404);

    user.role = roleId;
    await user.save();
    return res
      .status(200)
      .json({ message: "User  role updated successfully", user });
  } catch (error) {
    return handleError(
      res,
      error,
      "An error occurred while updating the user role"
    );
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!id) return handleError(res, null, "User  ID must be provided", 400);

  try {
    const result = await User.deleteOne({ _id: id });
    if (result.deletedCount === 0)
      return handleError(res, null, "User  not found", 404);
    return res.status(200).json({ message: "User  successfully deleted" });
  } catch (error) {
    return handleError(res, error, "An error occurred while deleting the user");
  }
};

// Update User Profile
exports.updateProfile = async (req, res, next) => {
  const {
    firstName,
    lastName,
    phoneNumber,
    address,
    city,
    province,
    postalCode,
    profilePicture,
  } = req.body;

  try {
    const profile = await UserProfile.findOneAndUpdate(
      { user: req.user.id },
      {
        firstName,
        lastName,
        phoneNumber,
        address,
        city,
        province,
        postalCode,
        profilePicture,
      },
      { new: true, upsert: true, runValidators: true }
    );

    if (!profile) return next(new AppError("Profile not found", 404));

    return res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      data: { profile },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return next(new AppError(error.message, 400));
    }
    return next(
      new AppError("An error occurred while updating the profile", 500)
    );
  }
};

// Update Specific user
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, profileDetails } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username, email },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User  not found" });
    }

    // Update the user's profile details
    const userProfile = await UserProfile.findOneAndUpdate(
      { user: updatedUser._id },
      profileDetails,
      { new: true, upsert: true, runValidators: true }
    );

    // Format the response
    const response = {
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: {
        name: updatedUser.role ? updatedUser.role.name : "No Role",
      },
      profileDetails: {
        firstName: userProfile?.firstName || "",
        lastName: userProfile?.lastName || "",
        phoneNumber: userProfile?.phoneNumber || "",
        address: userProfile?.address || "",
        city: userProfile?.city || "",
        province: userProfile?.province || "",
        postalCode: userProfile?.postalCode || "",
      },
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get User Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password -securityQuestion -securityQuestionAnswer")
      .populate("role", "name");

    if (!user) {
      return res.status(404).json({ message: "User  not found" });
    }

    const userProfile = await UserProfile.findOne({ user: user._id });
    const formattedUser = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: {
        name: user.role.name,
      },
      profileDetails: {
        firstName: userProfile?.firstName || "",
        lastName: userProfile?.lastName || "",
        phoneNumber: userProfile?.phoneNumber || "",
        address: userProfile?.address || "",
        city: userProfile?.city || "",
        province: userProfile?.province || "",
        postalCode: userProfile?.postalCode || "",
        profilePicture: userProfile?.profilePicture || "",
      },
    };

    return res.status(200).json(formattedUser);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching user profile" });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).populate('userProfile');
    console.log("Fetched user data:", user);
    
    if (!user) {
      return res.status(404).json({ message: "User  not found" });
    }

      return res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profilePicture: user.userProfile ? user.userProfile.profilePicture : null, 
      });

  } catch (error) {
    console.error("Error fetching user data:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -securityQuestion -securityQuestionAnswer")
      .populate("role", "name");

    if (!users || users.length === 0) {
      console.warn("No users found in the database.");
      return res.status(404).json({ message: "No users found." });
    }

    const formattedUsers = await Promise.all(
      users.map(async (user) => {


        const userProfile = await UserProfile.findOne({ user: user._id });
        if (!userProfile) {
          return {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: {
              name: user.role ? user.role.name : "No Role",
            },
            profileDetails: {
              firstName: "",
              lastName: "",
              phoneNumber: "",
              address: "",
              city: "",
              province: "",
              postalCode: "",
            },
          };
        }

        return {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: {
            name: user.role ? user.role.name : "No Role",
          },
          profileDetails: {
            firstName: userProfile.firstName || "",
            lastName: userProfile.lastName || "",
            phoneNumber: userProfile.phoneNumber || "",
            address: userProfile.address || "",
            city: userProfile.city || "",
            province: userProfile.province || "",
            postalCode: userProfile.postalCode || "",
          },
        };
      })
    );

    return res.status(200).json(formattedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    return handleError(res, error, "An error occurred while fetching users");
  }
};
