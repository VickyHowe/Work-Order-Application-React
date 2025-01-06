/**
 * Middleware to check if a user has the required role and permissions to perform a specific action.
 */

const roleCheck = (allowedRoles, action) => {
  return async (req, res, next) => {
    // Get the user's role, id, and the id of the user being edited or deleted
    const userRole = req.user.role;
    const userId = req.params.id;

    // Check if userRole is defined and has canAssign and permissions properties
    if (
      !userRole ||
      !Array.isArray(userRole.canAssign) ||
      !Array.isArray(userRole.permissions)
    ) {
      return res
        .status(403)
        .json({ message: "You do not have permission to perform this action" });
    }

    // Check if the user's role can perform the action
    const hasRolePermission =
      allowedRoles.includes(userRole.name) || userRole.canAssign.includes("*");

    // // Allow admin to bypass role permission checks
    // if (userRole.name === "admin") {
    //   return next();
    // }


    // Check if the user being modified is a golden user
    if (userId) {
      try {
        const userBeingModified = await User.findById(userId); // Await the user lookup
        if (userBeingModified && userBeingModified.isGolden) {
          return res
            .status(403) // Forbidden
            .json({ message: "You cannot edit or delete a golden user" });
        }
      } catch (error) {
        return next(new AppError("Error fetching user data", 500)); // Handle potential errors
      }
    }


    // If the user's role does not have permission, return an error
    if (!hasRolePermission) {
      return res
        .status(403)
        .json({ message: "You do not have permission to perform this action" });
    }

    // Prevent managers from editing or deleting themselves
    if (
      req.user._id.toString() === userId &&
      (action === "update" || action === "delete")
    ) {
      return res
        .status(403)
        .json({ message: "You cannot edit or delete yourself" });
    }

    // Check for specific action permissions
    const hasActionPermission = userRole.permissions.some(
      (permission) =>
        (permission.resource === "workorder" && permission.action === action) ||
        (permission.resource === "tasks" && permission.action === action) ||
        (permission.resource === "pricelist" && permission.action === action) ||
        (permission.resource === "report" && permission.action === action) ||
        (permission.resource === "*" && permission.action === "*")
    );

    // If the user's role does not have permission, return an error
    if (!hasActionPermission) {
      return res
        .status(403)
        .json({ message: "You do not have permission to perform this action" });
    }

    // If all checks pass, proceed to the next middleware
    next();
  };
};

module.exports = roleCheck;
