const express = require('express');
const router = express.Router();
const UserProfile = require('../models/UserProfile');
const bcrypt = require('bcryptjs');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: UserProfiles
 *   description: API for managing user profiles
 */

/**
 * @swagger
 * /api/userprofiles:
 *   post:
 *     summary: Create a new user profile
 *     tags: [User Profiles]
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
 *               email:
 *                 type: string
 *                 description: The user's email address
 *                 example: john.doe@example.com
 *               role:
 *                 type: string
 *                 description: The ID of the user's role
 *                 example: 60d5ec49d5f6c8b6d4f1e2b3
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
 *                 example: Springfield
 *               province:
 *                 type: string
 *                 description: The user's province
 *                 example: Illinois
 *               postalCode:
 *                 type: string
 *                 description: The user's postal code
 *                 example: 62701
 *     responses:
 *       201:
 *         description: User profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       400:
 *         description: Bad request
 */
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userProfile = new UserProfile({ ...req.body, password: hashedPassword });
        await userProfile.save();
        res.status(201).json(userProfile);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/userprofiles:
 *   get:
 *     summary: Get all user profiles
 *     tags: [User Profiles]
 *     responses:
 *       200:
 *         description: A list of user profiles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserProfile'
 *       500:
 *         description: Server error
 */
router.get('/', authMiddleware, async (req, res) => {
    try {
        const userProfiles = await UserProfile.find().populate('role');
        res.json(userProfiles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/userprofiles/{id}:
 *   put:
 *     summary: Update a user profile
 *     tags: [User Profiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The user profile ID
 *         schema:
 *           type: string
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
 *               email:
 *                 type: string
 *                 description: The user's email address
 *                 example: john.doe@example.com
 *               role:
 *                 type: string
 *                 description: The ID of the user's role
 *                 example: 60d5ec49d5f6c8b6d4f1e2b3
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
 *                 example: Springfield
 *               province:
 *                 type: string
 *                 description: The user's province
 *                 example: Illinois
 *               postalCode:
 *                 type: string
 *                 description: The user's postal code
 *                 example: 62701
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       400:
 *         description: Bad request
 */
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const userProfile = await UserProfile.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(userProfile);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/userprofiles/{id}:
 *   delete:
 *     summary: Delete a user profile
 *     tags: [User  Profiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The user profile ID
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: User profile deleted successfully
 *       500:
 *         description: Server error
 */
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await UserProfile.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     UserProfile:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           description: The user's first name
 *         lastName:
 *           type: string
 *           description: The user's last name
 *         email:
 *           type: string
 *           description: The user's email address
 *         role:
 *           type: string
 *           description: The ID of the user's role
 *         phoneNumber:
 *           type: string
 *           description: The user's phone number
 *         address:
 *           type: string
 *           description: The user's address
 *         city:
 *           type: string
 *           description: The user's city
 *         province:
 *           type: string
 *           description: The user's province
 *         postalCode:
 *           type: string
 *           description: The user's postal code
 */

module.exports = router;