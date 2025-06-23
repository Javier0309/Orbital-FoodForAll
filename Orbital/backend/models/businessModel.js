import mongoose from "mongoose";

const businessSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    name: { type: String, required: true },
<<<<<<< HEAD
    yearEstablished: { type: Number },
    about: { type: String },
    address: { type: String },
    foodHygieneCertUrl: { type: String },
    recommendedItems: [{ type: String }],
    email: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now }
});
=======
    email: { type: String, required: true, unique: true},
    createdAt: { type: Date, default: Date.now },
    isOpen: {type: Boolean, default: true}
})
>>>>>>> 1e8085ae733a8fedee9187bcb75a980c175fabf0

const businessModel = mongoose.models.business || mongoose.model("Business", businessSchema)
export default businessModel