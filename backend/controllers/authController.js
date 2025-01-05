const User = require("../models/User");
const UserProfile = require("../models/UserProfile");
const Role = require("../models/Role");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/tokenGenerator");
const AppError = require("../utils/AppError");

/**
 * Registers a new user.
 */
exports.register = async (req, res, next) => {
  // Destructure user data from the request body
  const {
    username,
    email,
    password,
    securityQuestion,
    securityQuestionAnswer,
  } = req.body;

  // Validate input: ensure all required fields are provided
  if (
    !username ||
    !email ||
    !password ||
    !securityQuestion ||
    !securityQuestionAnswer
  ) {
    return next(new AppError("All fields are required", 400));
  }
  // Validate password length
  if (password.length < 6) {
    return next(new AppError("Password must be at least 6 characters", 400));
  }

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return next(new AppError("Username already exists", 400));
    }

    // Check if the email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return next(new AppError("Email already exists", 400));
    }

    // Hash the password and the security question answer for security
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedAnswer = await bcrypt.hash(securityQuestionAnswer, 10);

    // Find the default role
    const defaultRole = await Role.findOne({ name: "customer" });
    if (!defaultRole) {
      return next(new AppError("Default role not found", 500));
    }

    // Create a new user in the database
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      securityQuestion,
      securityQuestionAnswer: hashedAnswer,
      role: defaultRole._id,
      IsGolden: false,
    });

    // Create a default user profile
    const userProfile = new UserProfile({
      user: user._id,
      firstName: "DefaultFirstName",
      lastName: "DefaultLastName",
      phoneNumber: "1111111111",
      address: "defaultAddress",
      city: "defaultCity",
      province: "defaultProvince",
      postalCode: "a1a1a1",
    });

    // Save the user profile to the database
    await userProfile.save();

    // Respond with a success message and the new user's ID
    return res.status(201).json({
      message: "User created successfully",
      user: { id: user._id },
    });
  } catch (err) {
    console.log(err); // log error for debugging
    return next(new AppError("An internal server error occurred", 500));
  }
};

/**
 * Logs in a user.
 * */
exports.login = async (req, res, next) => {
  // Destructure username and password from the request body
  const { username, password } = req.body;

  // Validate input: ensure both username and password are provided
  if (!username || !password) {
    return next(new AppError("Username or Password not present", 400));
  }

  try {
    // Find the user by username and populate their profile and role
    const user = await User.findOne({ username })
      .populate("userProfile")
      .populate("role");

    // Check if the user exists
    if (!user) {
      return next(new AppError("User  not found", 401));
    }
    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new AppError("Invalid password", 401));
    }

    const token = generateToken(user);

    // Respond with a success message and the user's ID
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        role: user.role.name,
        profilePicture: user.userProfile?.profilePicture || null,
      },
      token,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return next(new AppError("An error occurred", 500));
  }
};
