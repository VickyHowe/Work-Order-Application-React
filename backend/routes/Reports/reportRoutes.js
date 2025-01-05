/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Generate Reports
 */


const express = require("express");
const router = express.Router();
const { getReportData } = require("../../controllers/reportController");
const authMiddleware = require("../../middleware/authMiddleware");
const roleCheck = require("../../middleware/roleCheck");

/**
 * @swagger
 * /reports:
 *   get:
 *     summary: Get report data for work orders and tasks
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: [] 
 *     responses:
 *       200:
 *         description: Successfully retrieved report data
 *       403:
 *         description: You do not have permission to perform this action
 *       500:
 *         description: Error fetching report data
 */
router.get(
  "/",
  authMiddleware,
  roleCheck(["admin", "manager"], "view"),
  getReportData
);

module.exports = router;
