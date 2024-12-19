const express = require('express');
const authMiddleware = require('../../middleware/authMiddleware');
const roleCheck = require('../../middleware/roleCheck');
const taskController = require('../../controllers/taskController');
const pricelistController = require('../../controllers/pricelistController');

const router = express.Router();

// Task routes
router.use(authMiddleware);

// Pricelist routes
router.route('/pricelist')
    .get(pricelistController.getAllPricelists) // Get all pricelists
    .post(roleCheck(['manager', 'admin'], 'create'), pricelistController.createPricelist); // Create a new pricelist

module.exports = router;