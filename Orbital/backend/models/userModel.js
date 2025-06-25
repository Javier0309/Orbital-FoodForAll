import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    name: { type: String },
    userType: { type: String },
    cartData: {type:Object, default:{}}
});

const userModel = mongoose.models.User || mongoose.model("User", userSchema);
export default userModel;