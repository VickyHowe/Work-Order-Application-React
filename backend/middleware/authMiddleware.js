const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Token received:', token);
    if (!token) {
        return res.status(401).json({ message: 'Access denied. Please provide token.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch the user from the database and populate the role field
        const user = await User.findById(decoded.id).populate('role'); // Populate the role field
        if (!user) {
            return res.status(404).json({ message: 'User  not found' });
        }

        req.user = user; // Attach the user object to the request
        console.log('Authenticated user:', req.user._id);
        // console.log('Authenticated user:', req.user); // Log the authenticated user
        next(); 
    } catch (error) {
        console.error('Token verification failed:', error);
        return res.status(400).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;