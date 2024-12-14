const User = require("../../models/User");

exports.register = async (req, res) => {
    const { username, password } = req.body;
    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    try {
        const user = await User.create({ username, password });
        res.status(200).json({
            message: "User  created successfully",
            user
        });
    } catch (err) {
        res.status(401).json({
            message: "Error creating user",
            error: err.message
        });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body
    // Check if username and password is provided
    if (!username || !password) {
      return res.status(400).json({
        message: "Username or Password not present",
      })
    }
    try {
      const user = await User.findOne({ username, password })
      if (!user) {
        res.status(401).json({
          message: "Login not successful",
          error: "User not found",
        })
      } else {
        res.status(200).json({
          message: "Login successful",
          user,
        })
      }
    } catch (error) {
      res.status(400).json({
        message: "An error occurred",
        error: error.message,
      })
    }
  }
  exports.update = async (req, res, next) => {
    const { role, id } = req.body;

    // First - Verifying if role and id is present
    if (role && id) {
        // Second - Verifying if the value of role is admin
        if (role === "admin") {
            try {
                // Finds the user with the id
                const user = await User.findById(id);
                
                // Third - Verifies the user is not an admin
                if (user.role !== "admin") {
                    user.role = role;
                    await user.save(); // Save the updated user

                    res.status(201).json({ message: "Update successful", user });
                } else {
                    res.status(400).json({ message: "User  is already an Admin" });
                }
            } catch (error) {
                res.status(400).json({ message: "An error occurred", error: error.message });
            }
        } else {
            res.status(400).json({ message: "Role must be 'admin'" });
        }
    } else {
        res.status(400).json({ message: "Role and ID must be provided" });
    }
};

exports.deleteUser  = async (req, res, next) => {
  const { id } = req.body;

  if (!id) {
      return res.status(400).json({ message: "User  ID must be provided" });
  }

  try {
      const result = await User.deleteOne({ _id: id });

      if (result.deletedCount === 0) {
          return res.status(404).json({ message: "User  not found" });
      }

      res.status(200).json({ message: "User  successfully deleted" });
  } catch (error) {
      res.status(400).json({ message: "An error occurred", error: error.message });
  }
};