const Role = require('../models/Role');

exports.createRole = async (req, res) => {
    const { name, canAssign, permissions } = req.body; 

    // Check if the requester has permission to create roles
    const requester = req.user; 

    // Log the requester for debugging
    console.log('Requester:', JSON.stringify(requester, null, 2)); 
    console.log('Requester Permissions:', JSON.stringify(requester.role.permissions, null, 2)); 

    // Check if the requester has the 'create' permission for roles
    const hasCreatePermission = requester.role.permissions.some(permission => 
        (permission.resource === 'roles' && permission.action === 'create') || 
        (permission.resource === '*' && permission.action === '*') 
    );

    // Log the result of the permission check
    console.log('Has Create Permission:', hasCreatePermission); 

    if (!hasCreatePermission) {
        return res.status(403).json({ message: "You do not have permission to perform this action" });
    }

    if (!name || !Array.isArray(permissions)) {
        return res.status(400).json({ message: "Role name and permissions must be provided" });
    }

    try {
        const role = await Role.create({ name, canAssign, permissions });
        return res.status(201).json({ message: "Role created successfully", role });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An internal server error occurred" });
    }
};

