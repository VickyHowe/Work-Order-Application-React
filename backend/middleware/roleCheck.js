const roleCheck = (allowedRoles, action) => {
    return (req, res, next) => {
        const userRole = req.user.role; // Assuming req.user is populated with the authenticated user's data

        // Log the user's role
        console.log('User  Role:', userRole);

        // Check if userRole is defined and has canAssign property
        if (!userRole || !Array.isArray(userRole.canAssign)) {
            console.log('User  Role canAssign:', userRole ? userRole.canAssign : 'Role not found');
            return res.status(403).json({ message: "You do not have permission to perform this action" });
        }

        // Log allowed roles
        console.log('Allowed Roles:', allowedRoles);

        // Check if the user's role can perform the action
        const hasRolePermission = allowedRoles.some(role => 
            userRole.canAssign.includes(role) || userRole.canAssign.includes('*') // Check for wildcard
        );

        console.log('Has Role Permission:', hasRolePermission); // Log role permission check result

        if (!hasRolePermission) {
            return res.status(403).json({ message: "You do not have permission to perform this action" });
        }

        // Check for specific action permissions
        const hasActionPermission = userRole.permissions.some(permission => 
            (permission.resource === '*' && permission.action === '*') || // Wildcard check
            (permission.resource === 'roles' && permission.action === action) // Specific action check
        );

        console.log('Has Action Permission:', hasActionPermission); // Log action permission check result

        if (!hasActionPermission) {
            return res.status(403).json({ message: "You do not have permission to perform this action" });
        }

        // If all checks pass, proceed to the next middleware
        next();
    };
}

module.exports = roleCheck;