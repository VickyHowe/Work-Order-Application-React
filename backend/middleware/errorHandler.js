
/**
 * Middleware to handle errors in the application.
 *
 * This middleware captures errors thrown in the application and sends
 * a structured JSON response with the error details.
 */

const AppError = require("../utils/AppError");

const errorHandler = (err, req, res, next) => {
  // Set default values for error response
  const statusCode = err.statusCode || 500;
  const message = err.message || "An internal server error occurred";

  // Log the error
  // console.error(err);

  // Send the error response
  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
  });
};

module.exports = errorHandler;
