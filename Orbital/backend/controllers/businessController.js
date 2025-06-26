import orderModel from "../models/orderModel.js";
import businessModel from "../models/businessModel.js";
import mongoose from "mongoose";
//import { isProfileComplete } from "../utils/checkProfileComplete.js";


// POST: Set business open/closed status (using businessId)
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

// GET: Get open/closed status (using businessId as param)
const getOpenOrClosed = async (req, res) => {
    const { businessId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(businessId)) {
        return res.status(400).json({ success: false, message: "Invalid businessId" });
    }
    try {
        const business = await businessModel.findById(businessId).select('isOpen');
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

// PATCH to update order status 
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
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

const getOrdersForBusiness = async (req, res) => {
    const { businessId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(businessId)) {
      return res.status(400).json({ success: false, message: "Invalid businessId" });
    }
    try {
      const orders = await orderModel.find({ businessId });
      res.json({ success: true, orders });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching orders" });
    }
  };

// PUT business profile by businessId (with file upload)
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

        // Handle multiple cert uploads if present
        if (req.files) {
            if (req.files.hygieneCert && req.files.hygieneCert[0]) {
                updateData.foodHygieneCertUrl = `/uploads/certs/${req.files.hygieneCert[0].filename}`;
            }
            if (req.files.businessLicense && req.files.businessLicense[0]) {
                updateData.businessLicenseUrl = `/uploads/certs/${req.files.businessLicense[0].filename}`;
            }
            if (req.files.halalCert && req.files.halalCert[0]) {
                updateData.halalCertUrl = `/uploads/certs/${req.files.halalCert[0].filename}`;
            }
        } else if (req.file) {
            // Backward compatibility for single file upload (hygieneCert)
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
    updateOrderStatus, 
    getBusinessProfile, 
    updateBusinessProfile,
    getOrdersForBusiness
};