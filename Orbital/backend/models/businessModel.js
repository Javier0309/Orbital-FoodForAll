import mongoose from "mongoose";

const businessSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    name: { type: String, required: true },
    yearEstablished: { type: Number },
    about: { type: String },
    address: { type: String },
    foodHygieneCertUrl: { type: String },
    recommendedItems: [{ type: String }],
    email: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now }
});

const businessModel = mongoose.models.business || mongoose.model("Business", businessSchema)
export default businessModel