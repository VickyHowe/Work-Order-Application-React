const express = require('express');
const router = express.Router();
const Role = require('../models/Role');
const Permission = require('../models/Permissions'); // Ensure this is the correct path
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleCheckMiddleware');

/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Create a new role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roleName:
 *                 type: string
 *                 description: Name of the role
 *                 example: Custom
 *               description:
 *                 type: string
 *                 description: Description of the role
 *                 example: Custom role with full access
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of permission names for the role
 *                 example: [ "create_notifications", "view_notifications" ]
 *     responses:
 *       201:
 *         description: Role created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       400:
 *         description: Bad request
 *       403:
 *         description: Forbidden
 */
router.post('/', authMiddleware, roleMiddleware(['Admin', 'Manager']), async (req, res) => {
    console.log('Req user:', req.user);
    try {
        const { roleName, description, permissions } = req.body;

        // Find permission IDs based on names
        const permissionDocs = await Permission.find({ name: { $in: permissions } });
        const permissionIds = permissionDocs.map(perm => perm._id);

        // Create a new role 
        const role = new Role({
            roleName,
            description,
            permissions: permissionIds // Use the found permission IDs
        });

        // Save role to database
        await role.save();
        res.status(201).json(role);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Get all roles
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 *       500:
 *         description: Server error
 */
router.get('/', authMiddleware, async (req, res) => {
    try {
        const roles = await Role.find().populate('permissions'); 
        res.json(roles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/roles/{id}:
 *   put:
 *     summary: Update a role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The role ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roleName:
 *                 type: string
 *                 description: Name of the role
 *                 example: Admin
 *               description:
 *                 type: string
 *                 description: Description of the role
 *                 example: Administrator role with full access
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of permission names for the role
 *                 example: [ "create_notifications", "view_notifications" ]
 *     responses:
 *       200:
 *         description: Role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       400:
 *         description: Bad request
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Role not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Role not found
 */
router.put('/:id', authMiddleware, roleMiddleware(['Admin', 'Manager']), async (req, res) => {
    try {
        const { roleName, description, permissions } = req.body;

        // Find permission IDs based on names
        const permissionDocs = await Permission.find({ name: { $in: permissions } });
        const permissionIds = permissionDocs.map(perm => perm._id);

        const role = await Role.findByIdAndUpdate(req.params.id, { roleName, description, permissions: permissionIds }, { new: true });

        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }
        res.json(role);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/roles/{id}:
 *   delete:
 *     summary: Delete a role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The role ID
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Role deleted successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Role not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Role not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: Internal server error
 */
router.delete('/:id', authMiddleware, roleMiddleware(['Admin', 'Manager']), async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }
        await Role.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for the role
 *         roleName:
 *           type: string
 *           description: Name of the role
 *           example: Admin
 *         description:
 *           type: string
 *           description: Description of the role
 *           example: Administrator role with full access
 *         permissions:
 *           type: array
 *           items:
 *             type: string
 *           description: List of permission IDs associated with the role
 */

module.exports = router;