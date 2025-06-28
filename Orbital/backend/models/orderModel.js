import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    customerEmail: String,
    businessId: String,
    items:[{
       foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'foods'},
       name: String,
       quantity: Number,
       image: String,
       comment: String, 
    }],
    status: { type: String, default: 'pending'},
    createdAt: { type: Date, default: Date.now},
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', default: null},
    deliveryStatus: {type: String, enum: ['pending', 'assigned', 'in_transit', 'delivered'], default: 'pending'},
    deliveryMode: { type: String, enum: ['pickup', 'delivery'], default: 'pickup'},
    location: {latitude: Number, longitude: Number},
    customerAddress: {type: String},
    customerLocation: {latitude: Number, longitude: Number}, 
    businessAddress: {type: String},
    businessLocation: {latitude: Number, longitude: Number},

})

const orderModel = mongoose.model("orders", orderSchema);
export default orderModel;