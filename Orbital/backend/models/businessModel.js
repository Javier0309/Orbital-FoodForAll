import mongoose from "mongoose";

const businessSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true, ref: 'User'},
    name: { type: String, required: true },
    yearEstablished: { type: Number },
    about: { type: String },
    address: { type: String },
    hygieneCertUrl: { type: String },
    businessLicenseUrl: { type: String },
    halalCertUrl: { type: String },
    backgroundImageUrl: { type: String },
    phone: { type: String },

    // Other business fields
    recommendedItems: [{ type: String }],
    email: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
    isVerified: {type:Boolean, default: false},
    isOpen: {type: Boolean, default: true}
});

const businessModel = mongoose.models.Business || mongoose.model("Business", businessSchema);
export default businessModel;