const express = require('express');
const router = express.Router();
const WorkOrderHistory = require('../models/WorkOrderHistory');

/**
 * @swagger
 * tags:
 *   name: WorkOrderHistories
 *   description: API for managing work order history entries
 */

/**
 * @swagger
 * /api/workorderhistories:
 *   post:
 *     summary: Create a new work order history entry
 *     tags: [WorkOrderHistories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *                 description: The ID of the user associated with the work order
 *                 example: 60d5ec49d5f6c8b6d4f1e2b3
 *               workOrderDate:
 *                 type: string
 *                 format: date-time
 *                 description: The date of the work order
 *                 example: 2023-10-01T10:00:00Z
 *               description:
 *                 type: string
 *                 description: A description of the work order
 *                 example: "Completed installation of new equipment."
 *               status:
 *                 type: string
 *                 description: The status of the work order
 *                 example: "Completed"
 *     responses:
 *       201:
 *         description: Work order history entry created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkOrderHistory'
 *       400:
 *         description: Bad request
 */
router.post('/', async (req, res) => {
    try {
        const workOrderHistory = new WorkOrderHistory(req.body);
        await workOrderHistory.save();
        res.status(201).json(workOrderHistory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/workorderhistories:
 *   get:
 *     summary: Get all work order history entries
 *     tags: [WorkOrderHistories]
 *     responses:
 *       200:
 *         description: A list of work order history entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/WorkOrderHistory'
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
    try {
        const workOrderHistories = await WorkOrderHistory.find().populate('user');
        res.json(workOrderHistories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/workorderhistories/{id}:
 *   put:
 *     summary: Update a work order history entry
 *     tags: [WorkOrderHistories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the work order history entry
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
 *                 description: The ID of the user associated with the work order
 *                 example: 60d5ec49d5f6c8b6d4f1e2b3
 *               workOrderDate:
 *                 type: string
 *                 format: date-time
 *                 description: The date of the work order
 *                 example: 2023-10-01T10:00:00Z
 *               description:
 *                 type: string
 *                 description: A description of the work order
 *                 example: "Completed installation of new equipment."
 *               status:
 *                 type: string
 *                 description: The status of the work order
 *                 example: "Completed"
 *     responses:
 *       200:
 *         description: Work order history entry updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WorkOrderHistory'
 *       400:
 *         description: Bad request
 */
router.put('/:id', async (req, res) => {
    try {
        const workOrderHistory = await WorkOrderHistory.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(workOrderHistory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/workorderhistories/{id}:
 *   delete:
 *     summary: Delete a work order history entry
 *     tags: [WorkOrderHistories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the work order history entry
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Work order history entry deleted successfully
 *       500:
 *         description: Server error
 */
router.delete('/:id', async (req, res) => {
    try {
        await WorkOrderHistory.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     WorkOrderHistory:
 *       type: object
 *       properties:
 *         user:
 *           type: string
 *           description: The ID of the user associated with the work order
 *         workOrderDate:
 *           type: string
 *           format: date-time
 *           description: The date of the work order
 *         description:
 *           type: string
 *           description: A description of the work order
 *         status:
 *           type: string
 *           description: The status of the work order
 */

module.exports = router;