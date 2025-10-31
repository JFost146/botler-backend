import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();
const router = express.Router();

//register user
router.post("/register", async (req, res) => {
  try {
    let { username, password, role } = req.body;
    if (username) username = username.trim();

    //basic validation
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    //hash password
    //Password is hashed in schema so plain text is parsed

    //make user
    const user = new User({
      username,
      password,
      role: role || "user", // default role
      createdAt: new Date(),
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Username already exists" });
    }
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

//login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    //find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Username invalid" });
    }

    //check pass

    //debugging
    console.log("Logging in user:", user.username);
    console.log("Stored hash:", user.password);
    console.log("Password sent:", password);



    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = {
      id: user._id,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, username: user.username, role: user.role },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
