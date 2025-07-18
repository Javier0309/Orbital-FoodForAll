import reviewModel from "../models/reviewModel.js";
import mongoose from "mongoose";

// GET: Get all reviews for a business
export const getBusinessReviews = async (req, res) => {
  const { businessId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(businessId)) {
    return res.status(400).json({ success: false, message: "Invalid businessId" });
  }
  try {
    const reviews = await reviewModel.find({ businessId }).sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching reviews" });
  }
};

// POST: Add a review to a business
export const addBusinessReview = async (req, res) => {
  const { businessId } = req.params;
  const { customerName, rating, review } = req.body;
  if (!mongoose.Types.ObjectId.isValid(businessId)) {
    return res.status(400).json({ success: false, message: "Invalid businessId" });
  }
  if (!customerName || !rating || !review) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }
  if (typeof rating !== 'number' || rating < 1 || rating > 5) {
    return res.status(400).json({ success: false, message: "Rating must be 1-5" });
  }
  try {
    const newReview = new reviewModel({
      businessId,
      customerName,
      rating,
      review
    });
    await newReview.save();
    // Return updated reviews list
    const reviews = await reviewModel.find({ businessId }).sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error submitting review" });
  }
};