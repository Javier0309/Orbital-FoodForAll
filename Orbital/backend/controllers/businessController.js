import orderModel from "../models/orderModel.js";
import businessModel from "../models/businessModel.js";
import mongoose from "mongoose";
import driverModel from "../models/driverModel.js";


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
        const { status, reason } = req.body;

        const order = await orderModel.findById(orderId)
        if(!order) {
            return res.status(404).json({success: false, message:"Order not found"});
        }
        order.status = status;

        if (status === 'rejected' && reason !== undefined) {
            order.rejectionReason = reason;
            // If a driver is assigned, set them as available
            if (order.driverId) {
                await driverModel.findByIdAndUpdate(order.driverId, { isAvailable: true });
            }
        }

        if (order.deliveryStatus === 'delivered' || status === 'collected'){
            order.status='completed';
        }

        await order.save();

        res.json({success: true, message: "Order status updated", order});
    } catch (error) {
        console.error("Update order status error:", error);
        res.status(500).json({success: false, message:"Error updating order status"});
    }
};

// GET: Business profile by businessId
const getBusinessProfile = async (req, res) => {
    const { businessId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(businessId)) {
        return res.status(400).json({ success: false, message: "Invalid businessId" });
    }
    try {
        const {userId} = req.params;
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
                updateData.hygieneCertUrl = `/uploads/certs/${req.files.hygieneCert[0].filename}`;
            }
            if (req.files.businessLicense && req.files.businessLicense[0]) {
                updateData.businessLicenseUrl = `/uploads/certs/${req.files.businessLicense[0].filename}`;
            }
            if (req.files.halalCert && req.files.halalCert[0]) {
                updateData.halalCertUrl = `/uploads/certs/${req.files.halalCert[0].filename}`;
            }
            if (req.files.backgroundImage && req.files.backgroundImage[0]) {
                updateData.backgroundImageUrl = `/uploads/certs/${req.files.backgroundImage[0].filename}`;
            }
        } else if (req.file) {
            // Backward compatibility for single file upload (hygieneCert)
            updateData.hygieneCertUrl = `/uploads/certs/${req.file.filename}`;
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


const removeCompletedOrder = async (req, res) => {
    try{
        const { orderId } = req.params;
        const order = await orderModel.findById(orderId)

        if (!order) 
            return res.status(404).json({message: 'Order not found'})

        if (order.status !== 'completed' && order.status !== 'rejected')
            return res.status(400).json({message: 'Only completed orders can be removed'})

        order.removedByBusiness = true;
        await order.save();
        res.status(200).json({message: 'Order removed'})
    }catch (error) {
        res.status(500).json({message: 'Server error', error})
    }
}

// GET: Get completed orders count for a business
const getCompletedOrdersCount = async (req, res) => {
    const { businessId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(businessId)) {
        return res.status(400).json({ success: false, message: "Invalid businessId" });
    }
    try {
        // Count all orders with status 'completed' for this business
        const completedCount = await orderModel.countDocuments({
            businessId: businessId,
            status: 'completed'
        });
        
        res.json({ success: true, completedCount });
    } catch (error) {
        console.error("Error fetching completed orders count:", error);
        res.status(500).json({ success: false, message: "Error fetching completed orders count" });
    }
};


export { 
    openOrClosed, 
    updateOrderStatus, 
    getBusinessProfile, 
    updateBusinessProfile,
    getOpenOrClosed, 
    removeCompletedOrder,
    getOrdersForBusiness,
    getCompletedOrdersCount,
}