const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const roleCheck = require("../../middleware/roleCheck");
const roleController = require("../../controllers/roleController");

// Role routes
router
  .route("/create")
  .post(
    authMiddleware,
    roleCheck(["admin"], "create"),
    roleController.createRole
  );

router.get(
  "/roles",
  authMiddleware,
  roleCheck(["admin", "manager"], "view"),
  roleController.getAllRoles
);

module.exports = router;
