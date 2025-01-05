const User = require("../models/User");
const UserProfile = require("../models/UserProfile");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/tokenGenerator");
const AppError = require("../utils/AppError");

/**
 * Requests a password reset using security questions.
 */
exports.requestPasswordReset = async (req, res, next) => {
  const { username } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return next(new AppError("User not found", 404));
    return res.status(200).json({ securityQuestion: user.securityQuestion });
  } catch (error) {
    return next(
      new AppError("An error occurred while requesting password reset", 500)
    );
  }
};

/**
 * Requests a password reset using security questions.
 */
exports.verifySecurityQuestion = async (req, res, next) => {
  const { username, securityQuestionAnswer } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return next(new AppError("User not found", 404));

    const isMatch = await bcrypt.compare(
      securityQuestionAnswer,
      user.securityQuestionAnswer
    );
    if (!isMatch)
      return next(new AppError("Incorrect answer to security question", 400));

    const token = generateToken(user._id);
    return res.status(200).json({
      message:
        "Security question answered correctly. You can now reset your password.",
      token,
    });
  } catch (error) {
    return next(
      new AppError(
        "An error occurred while verifying the security question answer",
        500
      )
    );
  }
};

/**
 * Resets the password using a token.
 */
exports.resetPasswordWithToken = async (req, res, next) => {
  const { newPassword } = req.body;
  if (!newPassword) return next(new AppError("New password is required", 400));

  try {
    const user = req.user;
    if (!user) return next(new AppError("Invalid token", 401));

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return res
      .status(200)
      .json({ message: "Password has been reset successfully" });
  } catch (error) {
    return next(
      new AppError("An error occurred while resetting the password", 500)
    );
  }
};

/**
 * Updates the role of a user.
 */
exports.updateUserRole = async (req, res, next) => {
  const { roleId } = req.body;
  const { id } = req.params;

  if (!roleId) return next(new AppError("Role ID must be provided", 400));

  try {
    const user = await User.findById(id);
    if (!user) return next(new AppError("User not found", 404));

    // Check if the user is a golden user
    if (user.isGolden) {
      return next(new AppError("Cannot modify golden users", 403));
    }

    user.role = roleId;
    await user.save();
    return res
      .status(200)
      .json({ message: "User  role updated successfully", user });
  } catch (error) {
    return next(
      new AppError("An error occurred while updating the user role", 500)
    );
  }
};

/**
 * Deletes a user from the database.
 */

exports.deleteUser  = async (req, res, next) => {
  const { id } = req.params;

  if (!id) return next(new AppError("User  ID must be provided", 400));

  try {
    const user = await User.findById(id);
    if (!user) return next(new AppError("User  not found", 404));

    // Check if the user is a golden user
    if (user.isGolden) {
      return next(new AppError("Cannot delete golden users", 403));
    }

    const result = await User.deleteOne({ _id: id });
    if (result.deletedCount === 0) return next(new AppError("User  not found", 404));
    return res.status(200).json({ message: "User  successfully deleted" });
  } catch (error) {
    return next(new AppError("An error occurred while deleting the user", 500));
  }
};
/**
 * Updates the user's profile.
 */
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
    const user = await User.findById(req.user.id);
    if (!user) return next(new AppError("User  not found", 404));

    // Check if the user is a golden user
    if (user.isGolden) {
      return next(new AppError("Cannot modify golden users' profiles", 403));
    }

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
    return next(new AppError("An error occurred while updating the profile", 500));
  }
};

/**
 * Updates a specific user by ID.
 */
exports.updateUser = async (req, res, next) => {
  const { id } = req.params;
  const { username, email, profileDetails } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username, email },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return next(new AppError("User  not found", 404));
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
    console.error("Error updating user:", error); // Log the error for debugging purposes
    return next(new AppError("Server error", 500));
  }
};

/**
 * Retrieves the user's profile.
 */
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password -securityQuestion -securityQuestionAnswer")
      .populate("role", "name");

    if (!user) {
      return next(new AppError("User  not found", 404));
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
    console.error("Error fetching user profile:", error); // Log the error for debugging purposes
    return next(
      new AppError("An error occurred while fetching user profile", 500)
    );
  }
};

/**
 * Retrieves a user by ID.
 */
exports.getUserById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).populate("userProfile");

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    return res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      profilePicture: user.userProfile ? user.userProfile.profilePicture : null,
    });
  } catch (error) {
    console.error("Error fetching user data:", error); // Log the error for debugging purposes
    return next(new AppError("Server error", 500));
  }
};

/**
 * Retrieves all users from the database.
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select("-password -securityQuestion -securityQuestionAnswer")
      .populate("role", "name");

    if (!users || users.length === 0) {
      console.warn("No users found in the database.");
      return next(new AppError("No users found.", 404));
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
    console.error("Error fetching users:", error); // Log the error for debugging purposes
    return next(new AppError("An error occurred while fetching users", 500));
  }
};
