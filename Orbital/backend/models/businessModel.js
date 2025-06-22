import mongoose from "mongoose";

const businessSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true},
    createdAt: { type: Date, default: Date.now },
    isOpen: {type: Boolean, default: true}
})

const businessModel = mongoose.models.business || mongoose.model("Business", businessSchema)
export default businessModel