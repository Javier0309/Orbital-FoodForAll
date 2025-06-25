import orderModel from "../models/orderModel.js";
import businessModel from "../models/businessModel.js";
import mongoose from "mongoose";

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

// GET business profile by businessId
const getBusinessProfile = async (req, res) => {
    try {
        const {businessId} = req.params;
        const business = await businessModel.findById(businessId);
        if (!business) return res.status(404).json({ success: false, message: "Business not found" });
        res.json({ success: true, business });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching business profile" });
    }
}

// PUT business profile by businessId (with file upload)
const updateBusinessProfile = async (req, res) => {
    try {
        const {businessId} = req.params;
        let updateData = req.body;

        // Handle recommendedItems as array
        if (typeof updateData.recommendedItems === "string") {
            updateData.recommendedItems = updateData.recommendedItems.split(',').map(item => item.trim());
        }

        // Handle hygiene cert upload
        if (req.file) {
            updateData.foodHygieneCertUrl = `/uploads/certs/${req.file.filename}`;
        }

        const business = await businessModel.findByIdAndUpdate(
            businessId,
            updateData,
            { new: true }
        );
        res.json({ success: true, business });
    } catch (error) {
        console.error("Error in updateBusinessProfile:", error);
        res.status(500).json({ success: false, message: "Error updating business profile" });
    }
}

export { 
    getOrdersForBusiness, 
    updateOrderStatus, 
    getBusinessProfile, 
    updateBusinessProfile 
}