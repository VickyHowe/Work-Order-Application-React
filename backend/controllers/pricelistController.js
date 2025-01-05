const Pricelist = require("../models/Pricelist");
const AppError = require("../utils/AppError");

/**
 * Retrieves all pricelists from the database.
 */
exports.getAllPricelists = async (req, res, next) => {
  // Fetch all pricelists and populate the createdBy field
  try {
    const pricelists = await Pricelist.find().populate("createdBy");
    res.status(200).json(pricelists);
  } catch (error) {
    return next(new AppError("Error fetching pricelists", 500));
  }
};

/**
 * Creates a new pricelist item.
 */
exports.createPricelist = async (req, res, next) => {
  try {
    // Destructure item details from the request body
    const { itemName, price, description } = req.body;

    // Create a new pricelist item with the provided details
    const newItem = await Pricelist.create({
      itemName,
      price,
      description,
      createdBy: req.user._id,
    });
    res.status(201).json(newItem);
  } catch (error) {
    return next(new AppError("Error creating pricelist item", 500));
  }
};

/**
 * Creates a new work order request from a customer.
 */
exports.createWorkOrderRequest = async (req, res, next) => {
  try {
    // Destructure work order details from the request body
    const {
      title,
      description,
      customerComments,
      deadline,
      predefinedServices,
    } = req.body;

    // Create a new work order request with the provided details
    const workOrder = await WorkOrder.create({
      title,
      description,
      customerComments,
      status: "pending",
      createdBy: req.user._id,
      deadline,
      predefinedServices,
    });
    res.status(201).json(workOrder);
  } catch (error) {
    return next(new AppError("Error creating work order request", 500));
  }
};

/**
 * Updates an existing pricelist item.
 */
exports.updatePricelist = async (req, res, next) => {
  // Get the ID of the item to update
  const { id } = req.params;

  // Destructure updated details from the request body
  const { itemName, price, description } = req.body;

  try {
    // Find the pricelist item by ID and update its details
    const updatedItem = await Pricelist.findByIdAndUpdate(
      id,
      { itemName, price, description },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return next(new AppError("Pricelist item not found", 404));
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    return next(new AppError("Error updating pricelist item", 500));
  }
};

/**
 * Deletes a pricelist item.
 */
exports.deletePricelist = async (req, res, next) => {
  // Get the ID of the item to delete
  const { id } = req.params;

  try {
    // Find and delete the pricelist item by ID
    const deletedItem = await Pricelist.findByIdAndDelete(id);
    if (!deletedItem) {
      return next(new AppError("Pricelist item not found", 404));
    }

    res.status(200).json({ message: "Pricelist item successfully deleted!" });
  } catch (error) {
    return next(new AppError("Error deleting pricelist item", 500));
  }
};
