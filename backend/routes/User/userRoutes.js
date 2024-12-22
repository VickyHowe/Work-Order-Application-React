const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const userController = require("../../controllers/userController");
const roleCheck = require("../../middleware/roleCheck");

// User management routes
router.route("/update").put(authMiddleware, userController.updateProfile);

router.route("/delete").delete(authMiddleware, userController.deleteUser);

router
  .route("/profile")
  .get(authMiddleware, userController.getProfile)
  .put(authMiddleware, userController.updateProfile);

router.route("/update/:id").put(authMiddleware, userController.updateUser);

// Fetch all users
router.get(
  "/roles",
  authMiddleware,
  roleCheck(["admin", "manager"], "view"),
  userController.getAllUsers
);
router.get("/users/:id", 
  authMiddleware, 
  userController.getUserById);

router.put(
  "/:id/role",
  authMiddleware,
  roleCheck(["admin", "manager"], "update"),
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

// Delete a User
router.delete(
  "/delete/:id",
  authMiddleware,
  roleCheck(["admin"], "delete"),
  userController.deleteUser
);

module.exports = router;
