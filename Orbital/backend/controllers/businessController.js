import orderModel from "../models/orderModel.js";
import businessModel from "../models/businessModel.js";
import mongoose from "mongoose";

// POST: Set business open/closed status
const openOrClosed = async (req, res) => {
    const { businessId, isOpen } = req.body;
    if (!mongoose.Types.ObjectId.isValid(businessId)) {
        return res.status(400).json({ success: false, message: "Invalid businessId" });
    }
    try {
        await businessModel.findByIdAndUpdate(businessId, { isOpen });
        res.json({ success: true, message: `Shop is now ${isOpen ? 'open' : 'closed'}` });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'Failed to update shop status' });
    }
};

// GET: Get open/closed status
const getOpenOrClosed = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid businessId" });
    }
    try {
        const business = await businessModel.findById(id).select('isOpen');
        if (business) {
            res.json({ success: true, isOpen: business.isOpen });
        } else {
            res.json({ success: false, message: 'Shop not found' });
        }
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'Failed to fetch shop status' });
    }
};

// GET: Orders for a specific business
const getOrdersForBusiness = async (req, res) => {
    const { businessId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(businessId)) {
        return res.status(400).json({ success: false, message: "Invalid businessId" });
    }
    try {
        const orders = await orderModel.find({ businessId });
        res.json({ success: true, orders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ success: false, message: "Error fetching orders" });
    }
};

// PATCH: Update order status
const updateOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({ success: false, message: "Invalid orderId" });
    }
    try {
        const { status } = req.body;
        await orderModel.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: "Order status updated" });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ success: false, message: "Error updating status" });
    }
};

// GET: Business profile by businessId
const getBusinessProfile = async (req, res) => {
    const { businessId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(businessId)) {
        return res.status(400).json({ success: false, message: "Invalid businessId" });
    }
    try {
        const business = await businessModel.findById(businessId);
        if (!business) return res.status(404).json({ success: false, message: "Business not found" });
        res.json({ success: true, business });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching business profile" });
    }
};

// PUT: Update business profile (with file upload)
const updateBusinessProfile = async (req, res) => {
    const { businessId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(businessId)) {
        return res.status(400).json({ success: false, message: "Invalid businessId" });
    }
    try {
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
};

export {
    openOrClosed,
    getOpenOrClosed,
    getOrdersForBusiness,
    updateOrderStatus,
    getBusinessProfile,
    updateBusinessProfile
};