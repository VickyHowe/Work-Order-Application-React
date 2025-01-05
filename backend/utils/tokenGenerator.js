/**
 * Utility function to generate JWT.
 *
 * This function creates a JWT for a given user with a specified expiration time.
 */

const jwt = require("jsonwebtoken");

// Utility function to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

module.exports = { generateToken };
