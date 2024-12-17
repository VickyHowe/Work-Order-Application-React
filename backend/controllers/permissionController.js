const Role = require('../models/Role');
const User = require('../models/User');



// Assign permissions to a role
exports.assignPermissionsToRole = async (req, res) => {
    const { roleId, permissions } = req.body; 

    try {
        const role = await Role.findById(roleId);
        if (!role) {
            return res.status(404).json({ message: "Role not found" });
        }
        role.permissions.push(...permissions);
        await role.save();
        return res.status(200).json({ message: "Permissions assigned successfully", role });
    } catch (error) {
        console.error("Error assigning permissions:", error);
        return res.status(500).json({ message: "An error occurred while assigning permissions" });
    }
};
// Check if a user has a specific permission
exports.checkUserPermission = async (req, res) => {
    const userId = req.user.id; 
    const { resource, action } = req.body; 

    try {
        const user = await User.findById(userId).populate('role');

        // Check if the user has permission
        const hasPermission = user.role.permissions.some(permission => 
            (permission.resource === '*' || permission.resource === resource) && 
            (permission.action === '*' || permission.action === action)
        );

        if (!hasPermission) {
            return res.status(403).json({ message: "You do not have permission to perform this action" });
        }

        return res.status(200).json({ message: "Permission check successful" });
    } catch (error) {
        console.error("Error checking permission:", error);
        return res.status(500).json({ message: "An error occurred while checking permissions" });
    }
};