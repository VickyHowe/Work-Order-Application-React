const express = require('express');
const router = express.Router();
const Schedule = require('../models/Schedule');
const authMiddleware = require('../middleware/authMiddleware'); // Adjust the path as necessary

/**
 * @swagger
 * tags:
 *   name: Schedules
 *   description: API for managing schedules
 */

/**
 * @swagger
 * /api/schedules:
 *   post:
 *     summary: Create a new schedule
 *     tags: [Schedules]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *                 description: The ID of the user associated with the schedule
 *                 example: 60d5ec49d5f6c8b6d4f1e2b3
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 description: Start time of the event
 *                 example: 2023-10-01T09:00:00Z
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 description: End time of the event
 *                 example: 2023-10-01T10:00:00Z
 *               eventDescription:
 *                 type: string
 *                 description: Description of the event
 *                 example: Team meeting
 *     responses:
 *       201:
 *         description: Schedule created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Schedule'
 *       400:
 *         description: Bad request
 */
router.post('/', authMiddleware, async (req, res) => {
    try {
        const schedule = new Schedule(req.body);
        await schedule.save();
        res.status(201).json(schedule);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/schedules:
 *   get:
 *     summary: Get all schedules
 *     tags: [Schedules]
 *     responses:
 *       200:
 *         description: A list of schedules
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Schedule'
 *       500:
 *         description: Server error
 */
router.get('/', authMiddleware, async (req, res) => {
    try {
        const schedules = await Schedule.find().populate('user');
        res.json(schedules);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/schedules/{id}:
 *   put:
 *     summary: Update a schedule
 *     tags: [Schedules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The schedule ID
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
 *                 description: The ID of the user associated with the schedule
 *                 example: 60d5ec49d5f6c8b6d4f1e2b3
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 description: Start time of the event
 *                 example: 2023-10-01T09:00:00Z
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 description: End time of the event
 *                 example: 2023-10-01T10:00:00Z
 *               eventDescription:
 *                 type: string
 *                 description: Description of the event
 *                 example: Team meeting
 *     responses:
 *       200:
 *         description: Schedule updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Schedule'
 *       400:
 *         description: Bad request
 */
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const schedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(schedule);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/schedules/{id}:
 *   delete:
 *     summary: Delete a schedule
 *     tags: [Schedules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The schedule ID
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Schedule deleted successfully
 *       500:
 *         description: Server error
 */
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await Schedule.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Schedule:
 *       type: object
 *       properties:
 *         user:
 *           type: string
 *           format: ObjectId
 *           description: The ID of the user associated with the schedule
 *         startTime:
 *           type: string
 *           format: date-time
 *           description: Start time of the event
 *         endTime:
 *           type: string
 *           format: date-time
 *           description: End time of the event
 *         eventDescription:
 *           type: string
 *           description: Description of the event
 */

module.exports = router;