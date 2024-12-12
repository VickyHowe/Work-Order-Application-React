const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware'); 
const UserProfile = require('../models/UserProfile');
const Role = require('../models/Role');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: User registration
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The user's username
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 description: The user's email address
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 description: The user's password
 *                 example: password123
 *               role:
 *                 type: string
 *                 description: The user's role name
 *                 example: Customer
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *       400:
 *         description: User already exists or validation error
 */
router.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const user = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'Customer'
        });
        await user.save();

        // Create a new user profile
        const userProfile = new UserProfile({
            user: user._id,
        });
        await userProfile.save();

        // Generate a JWT token with the user's role
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ message: `User ${username} was created successfully`, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 description: The user's password
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token
 *       400:
 *         description: Invalid credentials
 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The user's first name
 *                 example: John
 *               lastName:
 *                 type: string
 *                 description: The user's last name
 *                 example: Doe
 *               phoneNumber:
 *                 type: string
 *                 description: The user's phone number
 *                 example: 1234567890
 *               address:
 *                 type: string
 *                 description: The user's address
 *                 example: 123 Main St
 *               city:
 *                 type: string
 *                 description: The user's city
 *                 example: Toronto
 *               province:
 *                 type: string
 *                 description: The user's province
 *                 example: Ontario
 *               postalCode:
 *                 type: string
 *                 description: The user's postal code
 *                 example: A1A 1A1
 *               role:
 *                 type: string
 *                 description: The user's role name
 *                 example: Admin
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: User profile not found
 *       403:
 *         description: Forbidden, insufficient permissions
 *       500:
 *         description: Server error
 */
router.put('/profile', authMiddleware, async (req, res) => {
    const { firstName, lastName, phoneNumber, address, city, province, postalCode, role } = req.body;
    const userId = req.user.id; 
    const requestingUser  = await User.findById(userId);

    try {
        // Find the user profile by user ID
        const userProfile = await UserProfile.findOne({ user: userId });
        if (!userProfile) {
            return res.status(400).json({ message: 'User  profile not found' });
        }

        // Update user profile information
        userProfile.firstName = firstName;
        userProfile.lastName = lastName;
        userProfile.phoneNumber = phoneNumber;
        userProfile.address = address;
        userProfile.city = city;
        userProfile.province = province;
        userProfile.postalCode = postalCode;

        // Check if the requesting user has permission to update the role
        if (role) {
            if (requestingUser .role !== 'Admin' && requestingUser .role !== 'Manager') {
                return res.status(403).json({ message: 'Forbidden, insufficient permissions' });
            }
            const userToUpdate = await User.findById(userId);
            if (userToUpdate) {
                userToUpdate.role = role;
                await userToUpdate.save();
            }
        }

        await userProfile.save(); 
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;