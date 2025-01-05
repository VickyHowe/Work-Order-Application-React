/**
 * @swagger
 * tags:
 *   name: Pricelists
 *   description: Pricelist Management
 */



const express = require("express");
const authMiddleware = require("../../middleware/authMiddleware");
const roleCheck = require("../../middleware/roleCheck");
const pricelistController = require("../../controllers/pricelistController");

const router = express.Router();

/**
 * @swagger
 * /pricelists:
 *   get:
 *     summary: Get all pricelists
 *     tags: [Pricelists]
 *     responses:
 *       200:
 *         description: A list of pricelists
 *         schema:
 *           type: array
 *           items:
 */
router.route("/").get(pricelistController.getAllPricelists);

// Middleware for authentication
router.use(authMiddleware);


/**
 * @swagger
 * /pricelists:
 *   post:
 *     summary: Create a new pricelist item
 *     tags: [Pricelists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Pricelist item details
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             itemName:
 *               type: string
 *               example: "Sample Item"
 *             price:
 *               type: number
 *               example: 19.99
 *             description:
 *               type: string
 *               example: "This is a sample item description."
 *     responses:
 *       201:
 *         description: Pricelist item created successfully
 *         schema:
 *       403:
 *         description: You do not have permission to perform this action
 *       500:
 *         description: Error creating pricelist item
 */
router
  .route("/")
  .post(
    roleCheck(["manager", "admin"], "create"),
    pricelistController.createPricelist
  );


/**
 * @swagger
 * /pricelists/{id}/work-order:
 *   post:
 *     summary: Create a new work order request from a customer
 *     tags: [Pricelists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: The ID of the pricelist item
 *       - in: body
 *         name: body
 *         description: Work order request details
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *               example: "New Work Order"
 *             description:
 *               type: string
 *               example: "Details about the work order."
 *             customerComments:
 *               type: string
 *               example: "Customer comments here."
 *             deadline:
 *               type: string
 *               format: date-time
 *               example: "2023-12-31T23:59:59Z"
 *             predefinedServices:
 *               type: array
 *               items:
 *                 type: string
 *                 example: "Service 1"
 *     responses:
 *       201:
 *         description: Work order request created successfully
 *       403:
 *         description: You do not have permission to perform this action
 *       500:
 *         description: Error creating work order request
 */
router
  .route("/:id/work-order")
  .post(
    roleCheck(["customer"], "create"),
    pricelistController.createWorkOrderRequest
  );


/**
 * @swagger
 * /pricelists/{id}:
 *   put:
 *     summary: Update a specific pricelist item
 *     tags: [Pricelists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: The ID of the pricelist item to update
 *       - in: body
 *         name: body
 *         description: Updated pricelist item details
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             itemName:
 *               type: string
 *               example: "Updated Item"
 *             price:
 *               type: number
 *               example: 29.99
 *             description:
 *               type : string
 *               example: "Updated description for the item."
 *     responses:
 *       200:
 *         description: Pricelist item updated successfully
 *       404:
 *         description: Pricelist item not found
 *       403:
 *         description: You do not have permission to perform this action
 *       500:
 *         description: Error updating pricelist item
 */
router
  .route("/:id")
  .put(
    roleCheck(["manager", "admin"], "update"),
    pricelistController.updatePricelist
  )

  /**
 * @swagger
 * /pricelists/{id}:
 *   delete:
 *     summary: Delete a specific pricelist item
 *     tags: [Pricelists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *         description: The ID of the pricelist item to delete
 *     responses:
 *       200:
 *         description: Pricelist item successfully deleted
 *       404:
 *         description: Pricelist item not found
 *       403:
 *         description: You do not have permission to perform this action
 *       500:
 *         description: Error deleting pricelist item
 */
  router
  .route("/:id")
  .delete(
    roleCheck(["manager", "admin"], "delete"),
    pricelistController.deletePricelist
  );

module.exports = router;
