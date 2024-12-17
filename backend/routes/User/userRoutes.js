const express = require("express");
const router = express.Router();
const authMiddleware = require('../../middleware/authMiddleware');
const userController = require('../../controllers/userController'); 

// User management routes
router.route("/update").put(authMiddleware, userController.update);
router.route("/delete").delete(authMiddleware, userController.deleteUser );
router.route("/profile").get(authMiddleware, userController.getProfile);
router.route("/profile").put(authMiddleware, userController.updateProfile);

// Password reset routes
router.post('/request-password-reset', userController.requestPasswordReset); 
router.post('/verify-security-question', userController.verifySecurityQuestion);
router.post('/reset-password', authMiddleware, userController.resetPasswordWithToken); 


module.exports = router;