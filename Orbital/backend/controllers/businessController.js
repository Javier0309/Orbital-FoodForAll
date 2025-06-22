import orderModel from "../models/orderModel.js";
import businessModel from "../models/businessModel.js";

// Open or closed
const openOrClosed = async (req,res) => {
    const {businessId, isOpen} = req.body;

    try {
        await businessModel.findByIdAndUpdate(businessId, {isOpen})
        res.json({success: true, message: `Shop is now ${isOpen? 'open' : 'closed'}`})
    } catch (error) {
        console.error(error)
        res.json({success:false, message:'Failed to update shop status'})
    }
}

const getOpenOrClosed = async (req, res) => {
    try {
        const business = await businessModel.findById(req.params.id).select('isOpen')
        if (business) {
           res.json({success: true, isOpen: business.isOpen}) 
        } else {
           res.json({success:false, message:'Shop not found'})
        }
    } catch (error) {
        console.error(error)
        res.json({success:false, message:'Failed to fetch shop status'})

    }
}

// GET orders for a specific business
const getOrdersForBusiness = async (req, res) => {
    try {
        const {businessId} = req.params;
        const orders = await orderModel.find({businessId});
        res.json({success: true, orders})
    } catch (error) {
        console.error("Error fetching orders:", error)
        res.status(500).json({success: false, message: "Error fetching orders"})
    }
}


// PATCH to update order status 
const updateOrderStatus = async (req,res) => {
    try {
        const {orderId} = req.params;
        const {status} = req.body;

        await orderModel.findByIdAndUpdate(orderId, {status})
        res.json({success: true, message: "Order status updated"})
    } catch (error) {
        console.error("Error updating order status:", error)
        res.status(500).json({success: false, message: "Error updating status"})
    }
}

export { openOrClosed, getOpenOrClosed,getOrdersForBusiness, updateOrderStatus }