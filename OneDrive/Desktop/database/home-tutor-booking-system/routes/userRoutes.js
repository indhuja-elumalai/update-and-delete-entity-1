const express = require("express");
const User = require("../models/user");

const userRoutes = express.Router();

userRoutes.post("/register", async (req, res) => {
  const { username, email, role } = req.body;

  if (!username || username.length < 3) {
    return res.status(400).json({ message: "Username must be at least 3 characters" });
  }

  const emailRegex = /[a-zA-Z0-9_\.\-]+[@][a-z]{1,}[\.][a-z]{1,}/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email" });
  }

  if (role !== "student" && role !== "tutor") {
    return res.status(400).json({ message: "Role must be 'student' or 'tutor'" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const newUser = new User({ username, email, role });
    await newUser.save();
    return res.status(201).json({ message: "User registered successfully", newUser });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

// Get all users
userRoutes.get("/all", async (req, res) => {
    try {
      const users = await User.find();
      return res.status(200).json(users);
    } catch (err) {
      return res.status(500).json({ message: "Error fetching users" });
    }
});

module.exports = userRoutes;
