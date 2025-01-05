const Role = require("../models/Role");
const User = require("../models/User");
const AppError = require("../utils/AppError");

/**
 * Assigns specific role permissions
 */
exports.assignPermissionsToRole = async (req, res, next) => {
  // Destructure roleId and permissions from the request body
  const { roleId, permissions } = req.body;

  try {
    // Find the role by its ID
    const role = await Role.findById(roleId);
    if (!role) {
      return next(new AppError("Role not found", 404));
    }
    // Add the new permissions to the role's existing permissions
    role.permissions.push(...permissions);
    await role.save();
    return res
      .status(200)
      .json({ message: "Permissions assigned successfully", role });
  } catch (error) {
    console.error("Error assigning permissions:", error); // log error for debugging
    return next(
      new AppError("Error occurred while assigning permissions", 500)
    );
  }
};

/**
 * Checks if a user has a specific permission.
 */
exports.checkUserPermission = async (req, res, next) => {
  // Get the user ID from the request object
  const userId = req.user.id;
  // Destructure resource and action from the request body
  const { resource, action } = req.body;

  try {
    // Find the user by ID and populate their role
    const user = await User.findById(userId).populate("role");

    // Check if the user has permission
    const hasPermission = user.role.permissions.some(
      (permission) =>
        (permission.resource === "*" || permission.resource === resource) &&
        (permission.action === "*" || permission.action === action)
    );

    if (!hasPermission) {
      return next(
        new AppError(
          "Sorry, You do not have permission to perform this action",
          403
        )
      );
    }

    return res.status(200).json({ message: "Permission check successful" });
  } catch (error) {
    console.error("Error checking permission:", error); // log error for debugging
    return next(
      new AppError("An error occurred while checking permissions", 500)
    );
  }
};
