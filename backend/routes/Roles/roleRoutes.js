/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Role Management
 */


const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const roleCheck = require("../../middleware/roleCheck");
const roleController = require("../../controllers/roleController");

/**
 * @swagger
 * /roles/create:
 *   post:
 *     summary: Create a new role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: [] 
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Role details
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               example: "Admin"
 *             canAssign:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["manager", "user"]
 *             permissions:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   resource:
 *                     type: string
 *                     example: "roles"
 *                   action:
 *                     type: string
 *                     example: "create"
 *     responses:
 *       201:
 *         description: Role created successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Role created successfully"
 *             role:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60d5ec49f1b2c8b1f8e4e1a1"
 *                 name:
 *                   type: string
 *                   example: "Admin"
 *                 canAssign:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["manager", "user"]
 *                 permissions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       resource:
 *                         type: string
 *                         example: "roles"
 *                       action:
 *                         type: string
 *                         example: "create"
 *       403:
 *         description: You do not have permission to perform this action
 *       400:
 *         description: Role name and permissions must be provided
 *       500:
 *         description: An internal server error occurred
 */
router
  .route("/create")
  .post(
    authMiddleware,
    roleCheck(["admin"], "create"),
    roleController.createRole
  );

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Get all roles
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []  
 *     responses:
 *       200:
 *         description: A list of roles
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 example: "60d5ec49f1b2c8b1f8e4e1a1"
 *               name:
 *                 type: string
 *                 example: "Admin"
 *               canAssign:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["manager", "user"]
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     resource:
 *                       type: string
 *                       example: "roles"
 *                     action:
 *                       type: string
 *                       example: "create"
 *       403:
 *         description: You do not have permission to perform this action
 *       500:
 *         description: An error occurred while fetching roles
 */
router.get(
  "/roles",
  authMiddleware,
  roleCheck(["admin", "manager"], "view"),
  roleController.getAllRoles
);

module.exports = router;
