import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  customerName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const reviewModel = mongoose.model("Review", reviewSchema);

export default reviewModel;