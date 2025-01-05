/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication
 */

const express = require("express");
const router = express.Router();
const authController = require("../../controllers/authController");

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:  // Specify required fields
 *               - username
 *               - email
 *               - password
 *               - securityQuestion
 *               - securityQuestionAnswer
 *             properties:
 *               username:
 *                 type: string
 *                 description: Unique username for the user
 *                 example: "john_doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Unique email address for the user
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 description: Password for the user (minimum 6 characters)
 *                 minLength: 6
 *                 example: "password123"
 *               securityQuestion:
 *                 type: string
 *                 description: Security question for account recovery
 *                 example: "What is your pet's name?"
 *               securityQuestionAnswer:
 *                 type: string
 *                 description: Answer to the security question
 *                 example: "Fluffy"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.route("/register").post(authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Log in a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:  // Specify required fields
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username for the user
 *                 example: "john_doe"
 *               password:
 *                 type: string
 *                 description: Password for the user
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     role:
 *                       type: string
 *                     profilePicture:
 *                       type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.route("/login").post(authController.login);

module.exports = router;
