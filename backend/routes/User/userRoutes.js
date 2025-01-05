/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User Management
 */

const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const userController = require("../../controllers/userController");
const roleCheck = require("../../middleware/roleCheck");

/**
 * @swagger
 * /users/update/{id}:
 *   put:
 *     summary: Update a specific user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: ID of the user to update
 *       - in: body
 *         name: body
 *         description: User details to update
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *               example: "newUsername"
 *             email:
 *               type: string
 *               example: "newEmail@example.com"
 *             profileDetails:
 *               type: object
 *               properties:
 *                 firstName:
 *                   type: string
 *                   example: "John"
 *                 lastName:
 *                   type: string
 *                   example: "Doe"
 *                 phoneNumber:
 *                   type: string
 *                   example: "123-456-7890"
 *                 address:
 *                   type: string
 *                   example: "123 Main St"
 *                 city:
 *                   type: string
 *                   example: "Anytown"
 *                 province:
 *                   type: string
 *                   example: "CA"
 *                 postalCode:
 *                   type: string
 *                   example: "12345"
 *     responses:
 *       200:
 *         description: User updated successfully
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: User not found
 *       500:
 *         description: An error occurred while updating the user
 */
router.route("/update").put(authMiddleware, userController.updateProfile);

/**
 * @swagger
 * /users/delete:
 *   delete:
 *     summary: Delete the authenticated user's account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User successfully deleted
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: User not found
 *       500:
 *         description: An error occurred while deleting the user
 */
router.route("/delete").delete(authMiddleware, userController.deleteUser);

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get the authenticated user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
 *         schema:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: "60d5ec49f1b2c8b1f8e4e1a1"
 *             username:
 *               type: string
 *               example: "user123"
 *             email:
 *               type: string
 *               example: "user@example.com"
 *             role:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: "admin"
 *             profileDetails:
 *               type: object
 *               properties:
 *                 firstName:
 *                   type: string
 *                   example: "John"
 *                 lastName:
 *                   type: string
 *                   example: "Doe"
 *                 phoneNumber:
 *                   type: string
 *                   example: "123-456-7890"
 *                 address:
 *                   type: string
 *                   example: "123 Main St"
 *                 city:
 *                   type: string
 *                   example: "Anytown"
 *                 province:
 *                   type: string
 *                   example: "CA"
 *                 postalCode:
 *                   type: string
 *                   example: "12345"
 *                 profilePicture:
 *                   type: string
 *                   example: "http://example.com/profile.jpg"
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: User not found
 *       500:
 *         description: An error occurred while fetching the user profile
 */
router.route("/profile").get(authMiddleware, userController.getProfile);

/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Update the authenticated user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: body
 *         name: body
 *         description: User profile details to update
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             firstName:
 *               type: string
 *               example: "John"
 *             lastName:
 *               type: string
 *               example: "Doe"
 *             phoneNumber:
 *               type: string
 *               example: "123-456-7890"
 *             address:
 *               type: string
 *               example: "123 Main St"
 *             city:
 *               type: string
 *               example: "Anytown"
 *             province:
 *               type: string
 *               example: "CA"
 *             postalCode:
 *               type: string
 *               example: "12345"
 *             profilePicture:
 *               type: string
 *               example: "http://example.com/profile.jpg"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               example: "success"
 *             message:
 *               type: string
 *               example: "Profile updated successfully"
 *             data:
 *               type: object
 *               properties:
 *                 profile:
 *                   type: object
 *                   properties:
 *                     firstName:
 *                       type: string
 *                       example: "John"
 *                     lastName:
 *                       type: string
 *                       example: "Doe"
 *                     phoneNumber:
 *                       type: string
 *                       example: "123-456-7890"
 *                     address:
 *                       type: string
 *                       example: "123 Main St"
 *                     city:
 *                       type: string
 *                       example: "Anytown"
 *                     province:
 *                       type: string
 *                       example: "CA"
 *                     postalCode:
 *                       type: string
 *                       example: "12345"
 *                     profilePicture:
 *                       type: string
 *                       example: "http://example.com/profile.jpg"
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: User not found
 *       500:
 *         description: An error occurred while updating the profile
 */
router.route("/profile").put(authMiddleware, userController.updateProfile);

router.route("/update/:id").put(authMiddleware, userController.updateUser);

/**
 * @swagger
 * /users/roles:
 *   get:
 *     summary: Fetch all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all users
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 example: "60d5ec49f1b2c8b1f8e4e1a1"
 *               username:
 *                 type: string
 *                 example: "user123"
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               role:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "admin"
 *               profileDetails:
 *                 type: object
 *                 properties:
 *                   firstName:
 *                     type: string
 *                     example: "John"
 *                   lastName:
 *                     type: string
 *                     example: "Doe"
 *                   phoneNumber:
 *                     type: string
 *                     example: "123-456-7890"
 *                   address:
 *                     type: string
 *                     example: "123 Main St"
 *                   city:
 *                     type: string
 *                     example: "Anytown"
 *                   province:
 *                     type: string
 *                     example: "CA"
 *                   postalCode:
 *                     type: string
 *                     example: "12345"
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: An error occurred while fetching users
 */
router.get(
  "/roles",
  authMiddleware,
  roleCheck(["admin", "manager"], "view"),
  userController.getAllUsers
);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retrieve a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: ID of the user to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved user
 *         schema:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: "60d5ec49f1b2c8b1f8e4e1a1"
 *             username:
 *               type: string
 *               example: "user123"
 *             email:
 *               type: string
 *               example: "user@example.com"
 *             role:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: "admin"
 *             profilePicture:
 *               type: string
 *               example: "http://example.com/profile.jpg"
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: User not found
 *       500:
 *         description: An error occurred while fetching the user
 */
router.get("/users/:id", authMiddleware, userController.getUserById);

/**
 * @swagger
 * /users/{id}/role:
 *   put:
 *     summary: Update a user's role
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: ID of the user whose role is to be updated
 *       - in: body
 *         name: body
 *         description: Role ID to assign to the user
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             roleId:
 *               type: string
 *               example: "60d5ec49f1b2c8b1f8e4e1a2"
 *     responses:
 *       200:
 *         description: User role updated successfully
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: User not found
 *       500:
 *         description: An error occurred while updating the user role
 */
router.put(
  "/:id/role",
  authMiddleware,
  roleCheck(["admin", "manager"], "update"),
  userController.updateUserRole
);

/**
 * @swagger
 * /users/request-password-reset:
 *   post:
 *     summary: Request a password reset using security questions
 *     tags: [Users]
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Username of the user requesting a password reset
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *               example: "user123"
 *     responses:
 *       200:
 *         description: Security question retrieved successfully
 *         schema:
 *           type: object
 *           properties:
 *             securityQuestion:
 *               type: string
 *               example: "What is your mother's maiden name?"
 *       404:
 *         description: User not found
 *       500:
 *         description: An error occurred while requesting password reset
 */
router.post("/request-password-reset", userController.requestPasswordReset);

/**
 * @swagger
 * /users/verify-security-question:
 *   post:
 *     summary: Verify the answer to the security question
 *     tags: [Users]
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Username and answer to the security question
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *               example: "user123"
 *             securityQuestionAnswer:
 *               type: string
 *               example: "Smith"
 *     responses:
 *       200:
 *         description: Security question answered correctly
 *         schema:
 *           type: object
 *           properties:
 *             securityQuestionAnswer:
 *               type: string
 *               example: "Security question answered correctly. You can now reset your password. Note if user is Golden User this will fail"

 *       400:
 *         description: Incorrect answer to security question
 *       404:
 *         description: User not found
 *       500:
 *         description: An error occurred while verifying the security question answer
 */
router.post("/verify-security-question", userController.verifySecurityQuestion);

/**
 * @swagger
 * /users/reset-password:
 *   post:
 *     summary: Reset the password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: body
 *         name: body
 *         description: New password to set
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             newPassword:
 *               type: string
 *               example: "newSecurePassword123!"
 *     responses:
 *       200:
 *         description: Password has been reset successfully
 *       401:
 *         description: Invalid token
 *       400:
 *         description: New password is required
 *       500:
 *         description: An error occurred while resetting the password
 */
router.post(
  "/reset-password",
  authMiddleware,
  userController.resetPasswordWithToken
);

/**
 * @swagger
 * /users/delete/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: ID of the user to delete
 *     responses:
 *       200:
 *         description: User successfully deleted
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: User not found
 *       500:
 *         description: An error occurred while deleting the user
 */
router.delete(
  "/delete/:id",
  authMiddleware,
  roleCheck(["admin"], "delete"),
  userController.deleteUser
);

module.exports = router;
