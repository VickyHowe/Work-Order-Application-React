const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Notifications = require('../models/Notifications');
const UserProfile = require('../models/UserProfile'); 
const authMiddleware = require('../middleware/authMiddleware');
const permissionMiddleware = require('../middleware/permissionMiddleware'); 

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: API for managing notifications
 */

/**
 * @swagger
 * /api/notifications:
 *   post:
 *     summary: Create a new notification
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: The notification message
 *                 example: Your profile has been updated successfully.
 *               isRead:
 *                 type: boolean
 *                 description: Indicates whether the notification has been read
 *                 example: false
 *               notificationDate:
 *                 type: string
 *                 format: date-time
 *                 description: The date the notification was created
 *                 example: 2023-10-01T12:00:00Z
 *     responses:
 *       201:
 *         description: Notification created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       400:
 *         description: Bad request
 */
router.post('/', authMiddleware, permissionMiddleware(['create_notifications']), async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user.id; // Assuming the user ID is available in the request after authentication

        // Create a new notification with the user reference
        const notification = new Notifications({
            user: userId, // Use the authenticated user's ID
            message,
            isRead: req.body.isRead || false,
            notificationDate: req.body.notificationDate || Date.now()
        });

        await notification.save();
        res.status(201).json({
            ...notification.toObject(),
            username: req.user.username // Include the username in the response
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get all notifications
 *     tags: [Notifications]
 *     responses:
 *       200:
 *         description: A list of notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *       500:
 *         description: Server error
 */
router.get('/', authMiddleware, permissionMiddleware(['view_notifications']), async (req, res) => {
    try {
        const notifications = await Notifications.find().populate('user', 'username'); 
        res.json(notifications.map(notification => ({
            ...notification.toObject(),
            username: notification.user ? notification.user.username : null 
        })));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/notifications/{id}:
 *   put:
 *     summary: Update a notification
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The notification ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 description: The notification message
 *                 example: Your profile has been updated successfully.
 *               isRead:
 *                 type: boolean
 *                 description: Indicates whether the notification has been read
 *                 example: false
 *               notificationDate:
 *                 type: string
 *                 format: date-time
 *                 description: The date the notification was created
 *                 example: 2023-10-01T12:00:00Z
 *     responses:
 *       200:
 *         description: Notification updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       400:
 *         description: Bad request
 */
router.put('/:id', authMiddleware, permissionMiddleware(['edit_notifications']), async (req, res) => {
    try {
        const notification = await Notifications.findByIdAndUpdate(req.params.id, req.body, { new: true });
 if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        res.json(notification);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/notifications/{id}:
 *   delete:
 *     summary: Delete a notification
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The notification ID
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Notification deleted successfully
 *       500:
 *         description: Server error
 */
router.delete('/:id', authMiddleware, permissionMiddleware(['delete_notifications']), async (req, res) => {
    try {
        const notification = await Notifications.findByIdAndDelete(req.params.id);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         user:
 *           type: string
 *           format: ObjectId
 *           description: The ID of the user associated with the notification
 *         notificationDate:
 *           type: string
 *           format: date-time
 *           description: The date the notification was created
 *         message:
 *           type: string
 *           description: The notification message
 *         isRead:
 *           type: boolean
 *           description: Indicates whether the notification has been read
 *         username:
 *           type: string
 *           description: The username of the user associated with the notification
 */

module.exports = router;