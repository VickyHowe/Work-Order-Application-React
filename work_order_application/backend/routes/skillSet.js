const express = require('express');
const router = express.Router();
const SkillSet = require('../models/SkillSet');

/**
 * @swagger
 * tags:
 *   name: SkillSets
 *   description: API for managing skill sets
 */

/**
 * @swagger
 * /api/skillsets:
 *   post:
 *     summary: Create a new skill set
 *     tags: [SkillSets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               skillName:
 *                 type: string
 *                 description: The name of the skill
 *                 example: JavaScript
 *               description:
 *                 type: string
 *                 description: A brief description of the skill
 *                 example: A versatile programming language primarily used for web development.
 *     responses:
 *       201:
 *         description: Skill set created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SkillSet'
 *       400:
 *         description: Bad request
 */
router.post('/', async (req, res) => {
    try {
        const skillSet = new SkillSet(req.body);
        await skillSet.save();
        res.status(201).json(skillSet);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/skillsets:
 *   get:
 *     summary: Get all skill sets
 *     tags: [SkillSets]
 *     responses:
 *       200:
 *         description: A list of skill sets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SkillSet'
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
    try {
        const skillSets = await SkillSet.find();
        res.json(skillSets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/skillsets/{id}:
 *   put:
 *     summary: Update a skill set
 *     tags: [SkillSets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The skill set ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               skillName:
 *                 type: string
 *                 description: The name of the skill
 *                 example: JavaScript
 *               description:
 *                 type: string
 *                 description: A brief description of the skill
 *                 example: A versatile programming language primarily used for web development.
 *     responses:
 *       200:
 *         description: Skill set updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SkillSet'
 *       400:
 *         description: Bad request
 */
router.put('/:id', async (req, res) => {
    try {
        const skillSet = await SkillSet.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(skillSet);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/skillsets/{id}:
 *   delete:
 *     summary: Delete a skill set
 *     tags: [SkillSets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The skill set ID
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Skill set deleted successfully
 *       500:
 *         description: Server error
 */
router.delete('/:id', async (req, res) => {
    try {
        await SkillSet.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     SkillSet:
 *       type: object
 *       properties:
 *         skillName:
 *           type: string
 *           description: The name of the skill
 *         description:
 *           type: string
 *           description: A brief description of the skill
 */

module.exports = router;