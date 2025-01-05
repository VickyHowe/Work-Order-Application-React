/**
 * @swagger
 * tags:
 *   name: Permissions
 *   description: Permissions management
 */

const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const roleCheck = require("../../middleware/roleCheck");
const permissionController = require("../../controllers/permissionController");

/**
 * @swagger
 * /permissions/assign:
 *   put:
 *     summary: Assign permissions to a role
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Role ID and permissions to assign
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             roleId:
 *               type: string
 *               example: "60d5ec49f1b2c8b1f8e4e1a1"
 *             permissions:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   resource:
 *                     type: string
 *                     example: "posts"
 *                   action:
 *                     type: string
 *                     example: "update"
 *     responses:
 *       200:
 *         description: Permissions assigned successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Permissions assigned successfully"
 *             role:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60d5ec49f1b2c8b1f8e4e1a1"
 *                 name:
 *                   type: string
 *                   example: "admin"
 *                 permissions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       resource:
 *                         type: string
 *                         example: "posts"
 *                       action:
 *                         type: string
 *                         example: "create"
 *       404:
 *         description: Role not found
 *       500:
 *         description: Error occurred while assigning permissions
 */
router
  .route("/assign")
  .put(
    authMiddleware,
    roleCheck(["Assign"], "assign"),
    permissionController.assignPermissionsToRole
  );

/**
 * @swagger
 * /permissions/check:
 *   post:
 *     summary: Check if a user has a specific permission
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Resource and action to check permissions
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             resource:
 *               type: string
 *               example: "posts"
 *             action:
 *               type: string
 *               example: "create"
 *     responses:
 *       200:
 *         description: Permission check successful
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Permission check successful"
 *       403:
 *         description: User does not have permission to perform this action
 *       500:
 *         description: An error occurred while checking permissions
 */
router
  .route("/check")
  .post(authMiddleware, permissionController.checkUserPermission);

module.exports = router;
