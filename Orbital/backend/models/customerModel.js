import mongoose from "mongoose";

const custSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true, ref: 'User'},
    email: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    phone: {type: String, required: true},
    address: {type: String, required: true},
    userType: {type: String, required: true},
    dietaryNeeds: {type: String, required: true},
    proofOfNeedUrl: {type: String, required: true},
    isVerified: {type:Boolean, default: false},

});

const custModel = mongoose.models.cust || mongoose.model("Customer", custSchema);
export default custModel;