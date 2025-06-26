import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
    userId: { type: MongoTopologyClosedError.Schema.Types.ObjectId, ref: 'users'},
    email: {type: String, required: true, unique: true},
    name: { type: String },
    phone: { type: String },
    userType: { type: String },
    vehicleType: { type: String },
    isAvailable: { type: Boolean, default: true},
    currentLocation: {
        latitude: Number,
        longitude: Number
    },
    totalDeliveries: { type: Number, default: 0 },
    volunteerHours: {type: Number, default: 0},
    preferredAreas: [String]

});

const driverModel = mongoose.models.driver || mongoose.model("Driver", userSchema);
export default driverModel;