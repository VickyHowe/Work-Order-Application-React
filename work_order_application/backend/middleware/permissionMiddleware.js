const permissionMiddleware = (requiredPermissions) => {
    return (req, res, next) => {
        const userPermissions = req.user.permissions; 

        const hasPermission = requiredPermissions.every(permission => userPermissions.includes(permission));
        if (!hasPermission) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    };
};
module.exports = permissionMiddleware;