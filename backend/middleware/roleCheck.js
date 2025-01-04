const roleCheck = (allowedRoles, action) => {
    return (req, res, next) => {
        const userRole = req.user.role; 
        console.log("Authenticated user:", req.user);
        console.log("Checking permissions for action:", action);

        const userId = req.params.id; 
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

        // Check if the user's role can perform the action
        const hasRolePermission = allowedRoles.includes(userRole.name) || userRole.canAssign.includes("*");

        // Allow admin to bypass role permission checks
        if (userRole.name === 'admin') {
            return next(); 
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
                (permission.resource === 'workorder' && permission.action === action) || 
                (permission.resource === 'tasks' && permission.action === action) || 
                (permission.resource === 'pricelist' && permission.action === action) || 
                (permission.resource === 'report' && permission.action === action) || 
                (permission.resource === "*" && permission.action === "*") 
        );

        console.log("Has Action Permission:", hasActionPermission); 

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