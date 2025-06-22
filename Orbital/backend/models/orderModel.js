import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    customerEmail: String,
    businessId: String,
    items:[{
       foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'foods'},
       name: String,
       quantity: Number,
       image: String 
    }],
    status: { type: String, default: 'pending'},
    createdAt: { type: Date, default: Date.now}
})

const orderModel = mongoose.model("orders", orderSchema);
export default orderModel;