import orderModel from "../models/orderModel.js";

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

export { getOrdersForBusiness, updateOrderStatus }