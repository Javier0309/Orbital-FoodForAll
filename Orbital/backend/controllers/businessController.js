import orderModel from "../models/orderModel.js";
import businessModel from "../models/businessModel.js";
<<<<<<< HEAD
import mongoose from "mongoose";
=======

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
>>>>>>> 1e8085ae733a8fedee9187bcb75a980c175fabf0

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

<<<<<<< HEAD
// GET business profile by userId
const getBusinessProfile = async (req, res) => {
    try {
        const {userId} = req.params;
        const business = await businessModel.findOne({ userId });
        if (!business) return res.status(404).json({ success: false, message: "Business not found" });
        res.json({ success: true, business });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching business profile" });
    }
}

// PUT business profile by userId (with file upload)
const updateBusinessProfile = async (req, res) => {
    try {
        const {userId} = req.params;
        let updateData = req.body;

        // Handle recommendedItems as array
        if (typeof updateData.recommendedItems === "string") {
            updateData.recommendedItems = updateData.recommendedItems.split(',').map(item => item.trim());
        }

        // Handle hygiene cert upload
        if (req.file) {
            updateData.foodHygieneCertUrl = `/uploads/certs/${req.file.filename}`;
        }

        const business = await businessModel.findOneAndUpdate(
            { userId },
            updateData,
            { new: true, upsert: true }
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
=======
export { openOrClosed, getOpenOrClosed,getOrdersForBusiness, updateOrderStatus }
>>>>>>> 1e8085ae733a8fedee9187bcb75a980c175fabf0
