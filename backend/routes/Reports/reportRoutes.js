const express = require("express");
const router = express.Router();
const { getReportData } = require("../../controllers/reportController");
const authMiddleware = require("../../middleware/authMiddleware");
const roleCheck = require("../../middleware/roleCheck");

// Get Reports Route
router.get(
  "/",
  authMiddleware,
  roleCheck(["admin", "manager"], "read"),
  getReportData
);

module.exports = router;
