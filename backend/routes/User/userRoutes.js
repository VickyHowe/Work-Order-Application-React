const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const userController = require("../../controllers/userController");
const roleCheck = require("../../middleware/roleCheck");

// User management routes
router.route("/update").put(authMiddleware, userController.updateProfile); // Ensure this matches the function name
router.route("/delete").delete(authMiddleware, userController.deleteUser );
router
  .route("/profile")
  .get(authMiddleware, userController.getProfile)
  .put(authMiddleware, userController.updateProfile);

// Fetch all users
router.get(
    "/role",
    authMiddleware,
    roleCheck(["admin"], "view"),
    userController.getAllUsers
  );
  router.put(
    "/:id/role",
    authMiddleware,
    roleCheck(["admin"], "update"),
    userController.updateUserRole 
  );


// Password reset routes
router.post("/request-password-reset", userController.requestPasswordReset);
router.post("/verify-security-question", userController.verifySecurityQuestion);
router.post(
  "/reset-password",
  authMiddleware,
  userController.resetPasswordWithToken
);



module.exports = router;