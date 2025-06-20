import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    cartData: {type:Object, default:{}}
});

const userModel = mongoose.model("users", userSchema);
export default userModel;