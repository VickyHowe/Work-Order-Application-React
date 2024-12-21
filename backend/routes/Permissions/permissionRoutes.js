const express = require("express");
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const roleCheck = require('../../middleware/roleCheck'); 
const permissionController = require('../../controllers/permissionController'); 

// Permission routes
router.route("/assign").put(authMiddleware, roleCheck(['Assign'], 'assign'), permissionController.assignPermissionsToRole);
router.route("/check").post(authMiddleware, permissionController.checkUserPermission);

module.exports = router;