const express = require("express");
const authMiddleware = require("../../middleware/authMiddleware");
const roleCheck = require("../../middleware/roleCheck");
const pricelistController = require("../../controllers/pricelistController");

const router = express.Router();

router.use(authMiddleware);

// Pricelist routes
router
  .route("/")
  .get(pricelistController.getAllPricelists)
  .post(
    roleCheck(["manager", "admin"], "create"),
    pricelistController.createPricelist
  );

// Create a new work order request from a customer
router
  .route("/:id/work-order")
  .post(
    roleCheck(["customer"], "create"),
    pricelistController.createWorkOrderRequest
  );
// Update and delete a specific pricelist item
router
  .route("/:id")
  .put(
    roleCheck(["manager", "admin"], "update"),
    pricelistController.updatePricelist
  )
  .delete(
    roleCheck(["manager", "admin"], "delete"),
    pricelistController.deletePricelist
  );


module.exports = router;
