const User = require("../models/User");
const UserProfile = require("../models/UserProfile"); 
const Role = require("../models/Role"); // Import the Role model
const bcrypt = require("bcryptjs");
const { generateToken } = require('../utils/tokenGenerator'); 
const AppError = require('../utils/AppError');

exports.register = async (req, res, next) => {
    const { username, email, password, securityQuestion, securityQuestionAnswer } = req.body;

    // Validate input
    if (!username || !email || !password || !securityQuestion || !securityQuestionAnswer) {
        return next(new AppError("All fields are required", 400));
    }

    if (password.length < 6) {
        return next(new AppError("Password must be at least 6 characters", 400));
    }

    try {
        const existingUser   = await User.findOne({ username });
        if (existingUser  ) {
            return next(new AppError("Username already exists", 400));
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return next(new AppError("Email already exists", 400));
        }

        // Hash the password and the security question answer
        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedAnswer = await bcrypt.hash(securityQuestionAnswer, 10);

        // Find the default role (e.g., "Customer")
        const defaultRole = await Role.findOne({ name: "customer" }); // Change "Customer" to your default role name
        if (!defaultRole) {
            return next(new AppError("Default role not found", 500));
        }

        // Create a new user
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            securityQuestion,
            securityQuestionAnswer: hashedAnswer,
            role: defaultRole._id, // Assign the default role
        });

        // Create a default user profile
        const userProfile = new UserProfile({
            user: user._id, 
            firstName: 'DefaultFirstName', 
            lastName: 'DefaultLastName', 
            phoneNumber: '1111111111', 
            address: 'defaultAddress', 
            city: 'defaultCity', 
            province: 'defaultProvince', 
            postalCode: 'a1a1a1' 
        });

        // Save the user profile to the database
        await userProfile.save();

        return res.status(201).json({
            message: "User  created successfully",
            user: { id: user._id },
        });
    } catch (err) {
        console.log(err);
        return next(new AppError("An internal server error occurred", 500));
    }
};
exports.login = async (req, res, next) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return next(new AppError("Username or Password not present", 400));
    }

    try {
        const user = await User.findOne({ username }).populate('role');
        if (!user) {
            return next(new AppError("User not found", 401));
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return next(new AppError("Invalid password", 401));
        }

        // Generate JWT token
        const token = generateToken(user);

        return res.status(200).json({
            message: "Login successful",
            user: { id: user._id, role: user.role.name },
            token,
        });
    } catch (error) {
        return next(new AppError("An error occurred", 500));
    }
};