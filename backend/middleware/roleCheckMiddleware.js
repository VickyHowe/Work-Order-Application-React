const Role = require('../models/Role');

const roleMiddleware = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      // Check if the user is authenticated
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Check if the user object has a role property
      if (!req.user.role) {
        console.error('req.user does not have a role property');
        return res.status(500).json({ message: 'Internal Server Error' });
      }

      console.log('req.user.role:', req.user.role);

      // Find the user's role
      const userRole = await Role.findOne({ roleName: req.user.role });

      // Check if the user's role exists
      if (!userRole) {
        console.error(`Role not found for user with role ${req.user.role}`);
        return res.status(403).json({ message: 'Unauthorized' });
      }

      // Check if the user's role is in the allowed roles
      if (!allowedRoles.includes(userRole.roleName)) {
        console.error(`User  with role ${req.user.role} does not have an allowed role`);
        return res.status(403).json({ message: 'Unauthorized' });
      }

      // If the user has the allowed role, call the next middleware
      next();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };
};

module.exports = roleMiddleware;