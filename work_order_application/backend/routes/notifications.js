const express = require('express');
const router = express.Router();
const Notifications = require('../models/Notifications');
const authMiddleware = require('../middleware/authMiddleware');

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
 *               user:
 *                 type: string
 *                 description: The ID of the user associated with the notification
 *                 example: 60d5ec49d5f6c8b6d4f1e2b3
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
router.post('/', authMiddleware, async (req, res) => {
    try {
        const notification = new Notifications(req.body);
        await notification.save();
        res.status(201).json(notification);
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
router.get('/', authMiddleware, async (req, res) => {
    try {
        const notifications = await Notifications.find().populate('user');
        res.json(notifications);
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
 *               user:
 *                 type: string
 *                 description: The ID of the user associated with the notification
 *                 example: 60d5ec49d5f6c8b6d4f1e2b3
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
 *           application /json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       400:
 *         description: Bad request
 */
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const notification = await Notifications.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await Notifications.findByIdAndDelete(req.params.id);
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
 */

module.exports = router;