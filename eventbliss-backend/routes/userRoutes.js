const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { protect, authorize } = require("../middleware/auth");
const User = require("../models/User");

// Get all users (Owner only)
router.get("/", protect, authorize("owner"), async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

// Get the current user's profile
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Update the current user's profile
router.put("/me", protect, async (req, res) => {
  const { username, email, profile_pic, oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (newPassword) {
      if (!oldPassword) {
        return res.status(400).json({ message: "Current password is required to update password" });
      }
      if (!(await user.matchPassword(oldPassword))) {
        return res.status(401).json({ message: "Incorrect current password" });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }
    
    let newEmailToken = null;
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email is already in use" });
      }
      user.email = email;
      
      const payload = {
        user: {
          id: user.id,
          role: user.role
        }
      };
      newEmailToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
    }

    user.username = username || user.username;
    user.profile_pic = profile_pic || user.profile_pic;

    await user.save();
    
    res.json({ message: "Profile updated successfully", token: newEmailToken, name: user.username });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a user's role (Owner only)
router.put("/:id", protect, authorize("owner"), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        if (user.id === req.user.id) {
            return res.status(403).json({ message: "You cannot change your own role" });
        }

        user.role = req.body.role || user.role;
        await user.save();

        res.json({ message: "User role updated successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

// Update a user's status (Owner only)
router.put("/status/:id", protect, authorize("owner"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    if (user.id === req.user.id) {
        return res.status(403).json({ message: "You cannot change your own status" });
    }

    user.status = req.body.status || user.status;
    await user.save();

    res.json({ message: "User status updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});


// Delete a user (Owner only)
router.delete("/:id", protect, authorize("owner"), async (req, res) => {
    try {
        if (req.params.id === req.user.id) {
            return res.status(403).json({ message: "You cannot delete your own account" });
        }
        
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;