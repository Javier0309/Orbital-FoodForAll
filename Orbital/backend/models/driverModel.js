import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true, ref: 'User'},
    email: {type: String, required: true, unique: true},
    name: { type: String, required: true },
    phone: { type: String, required: true },
    userType: { type: String, required: true },
    vehicleType: { type: String, required: true },
    licensePlate: { type: String, required: true },
    totalDeliveries: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true},
    about: { type: String },
    profilePicUrl: {type: String},
    currentLocation: {
        latitude: Number,
        longitude: Number
    },
});

const driverModel = mongoose.models.driver || mongoose.model("Driver", driverSchema);
export default driverModel;