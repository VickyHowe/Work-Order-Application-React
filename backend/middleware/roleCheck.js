const roleCheck = (allowedRoles, action) => {
    return (req, res, next) => {
        const userRole = req.user.role; // Assuming req.user is populated with the authenticated user's data
        const userId = req.params.id; // Get the user ID from the request parameters
        console.log("Authenticated user:", req.user);

        // Check if userRole is defined and has canAssign and permissions properties
        if (
            !userRole ||
            !Array.isArray(userRole.canAssign) ||
            !Array.isArray(userRole.permissions)
        ) {
            console.log("User  Role or Permissions not found:", userRole);
            return res
                .status(403)
                .json({ message: "You do not have permission to perform this action" });
        }

        // Log allowed roles
        console.log("Allowed Roles:", allowedRoles);

        // Check if the user's role can perform the action
        const hasRolePermission = allowedRoles.includes(userRole.name) || userRole.canAssign.includes("*");

        console.log("Has Role Permission:", hasRolePermission); // Log role permission check result

        // Allow admin to bypass role permission checks
        if (userRole.name === 'admin') {
            return next(); // Admins can perform any action
        }

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
                (permission.resource === "roles" && permission.action === action) || // Check for roles and the specific action
                (permission.resource === "*" && permission.action === "*") // Allow all actions on all resources for admin
        );

        console.log("Has Action Permission:", hasActionPermission); // Log action permission check result

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