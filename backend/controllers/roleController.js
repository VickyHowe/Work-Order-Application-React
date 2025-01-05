const Role = require("../models/Role");
const AppError = require("../utils/AppError");

/**
 * Creates a new role.
 */
exports.createRole = async (req, res, next) => {
  // Extract the role name and permissions from the request body
  const { name, canAssign, permissions } = req.body;

  // Check if the requester has permission to create roles
  const requester = req.user;

  // Check if the requester has the 'create' permission for roles
  const hasCreatePermission = requester.role.permissions.some(
    (permission) =>
      (permission.resource === "roles" && permission.action === "create") ||
      (permission.resource === "*" && permission.action === "*")
  );

  if (!hasCreatePermission) {
    return next(
      new AppError("You do not have permission to perform this action", 403)
    );
  }

  if (!name || !Array.isArray(permissions)) {
    return next(
      new AppError("Role name and permissions must be provided", 400)
    );
  }

  try {
    const role = await Role.create({ name, canAssign, permissions });
    return res.status(201).json({ message: "Role created successfully", role });
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    return next(new AppError("An internal server error occurred", 500));
  }
};

/**
 * Retrieves all roles.
 */
exports.getAllRoles = async (req, res, next) => {
  try {
    // Fetch all roles from the database
    const roles = await Role.find();
    return res.status(200).json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error); // Log the error for debugging purposes
    return next(new AppError("An error occurred while fetching roles", 500));
  }
};
