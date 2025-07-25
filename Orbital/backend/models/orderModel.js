import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    customerEmail: String,
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business' },
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
    removedByBusiness: {type: Boolean, default: false},
    removedByDriver: {type: Boolean, default: false},
    removedByCustomer: {type: Boolean, default: false},
    rejectionReason: { type: String, default: '' },
})

const orderModel = mongoose.model("orders", orderSchema);
export default orderModel;