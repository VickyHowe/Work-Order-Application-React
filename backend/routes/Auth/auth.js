const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

// Utility function to generate JWT
const generateToken = (user) => {
    return jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

exports.register = async (req, res) => {
    const { username, password } = req.body;

    // Validate password length
    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    try {
        // Hash the password
        const hash = await bcrypt.hash(password, 10);
        
        // Create the user
        const user = await User.create({ username, password: hash });
        
        return res.status(201).json({
            message: "User  created successfully",
            user: { id: user._id } 
        });
    } catch (err) {
        return res.status(400).json({
            message: "Error creating user",
            error: err.message
        });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({
            message: "Username or Password not present",
        });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({
                message: "Login not successful",
                error: "User  not found",
            });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Login not successful",
                error: "Invalid password",
            });
        }

        // Generate JWT token
        const token = generateToken(user);

        return res.status(200).json({
            message: "Login successful",
            user: { id: user._id }, 
            token, 
        });
    } catch (error) {
        return res.status(400).json({
            message: "An error occurred",
            error: error.message,
        });
    }
};

exports.update = async (req, res) => {
    const { role, id } = req.body;

    // Validate role and id
    if (!role || !id) {
        return res.status(400).json({ message: "Role and ID must be provided" });
    }

    if (role !== "admin") {
        return res.status(400).json({ message: "Role must be 'admin'" });
    }

    try {
        const user = await User.findById(id);
        
        // Check if user exists and is not already an admin
        if (!user) {
            return res.status(404).json({ message: "User  not found" });
        }

        if (user.role === "admin") {
            return res.status(400).json({ message: "User  is already an Admin" });
        }

        user.role = role;
        await user.save();

        return res.status(200).json({ message: "Update successful", user: { id: user._id } });
    } catch (error) {
        return res.status(400).json({ message: "An error occurred", error: error.message });
    }
};

exports.deleteUser  = async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: "User  ID must be provided" });
    }

    try {
        const result = await User.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "User  not found" });
        }

        return res.status(200).json({ message: "User  successfully deleted" });
    } catch (error) {
        return res.status(400).json({ message: "An error occurred", error: error.message });
    }
};