import express from "express";
import { getBusinessReviews, addBusinessReview } from "../controllers/reviewController.js";

const router = express.Router();

// GET reviews for a business
router.get("/business/:businessId/reviews", getBusinessReviews);

// POST a review for a business
router.post("/business/:businessId/reviews", addBusinessReview);

export default router;