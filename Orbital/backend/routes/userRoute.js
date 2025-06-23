import express from "express";
import userModel from "../models/userModel.js"; // Make sure this points to your userModel.js

const router = express.Router();

// Create a new MongoDB user (called after Supabase signup)
router.post("/create", async (req, res) => {
  try {
    const { email, name, userType } = req.body;
    let user = await userModel.findOne({ email });
    if (!user) {
      user = await userModel.create({ email, name, userType });
    }
    res.json({ success: true, userId: user._id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get MongoDB user by email (called after Supabase login)
router.get("/by-email/:email", async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.params.email });
    if (!user) return res.json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;