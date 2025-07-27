import { getOpenOrClosed, getOrdersForBusiness, openOrClosed, updateOrderStatus, removeCompletedOrder, getCompletedOrdersCount } from '../controllers/businessController.js';
import express from 'express';
import multer from "multer";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";
import { getBusinessProfile, updateBusinessProfile} from '../controllers/businessController.js';
import router from './recoveryRoutes.js';
import businessModel from '../models/businessModel.js';

const busRouter = express.Router();

// Ensure certs upload directory exists
const certsDir = path.join('uploads', 'certs');
if (!fs.existsSync(certsDir)) {
    fs.mkdirSync(certsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/certs/"),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Open or close business
busRouter.post('/openOrClosed', openOrClosed);

// Get business open/closed status
busRouter.get('/status/:businessId', getOpenOrClosed);

// Get orders for business
busRouter.get('/orders/:businessId', getOrdersForBusiness);

// Get completed orders count for business
busRouter.get('/completed-orders/:businessId', getCompletedOrdersCount);

// Update order status
busRouter.patch('/orders/:orderId/status', updateOrderStatus);

// Get business profile
busRouter.get('/profile/:businessId', async (req, res, next) => {
  const { businessId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(businessId)) {
    return res.status(400).json({ success: false, message: "Invalid businessId" });
  }
  return getBusinessProfile(req, res, next);
});

// Update business profile with multiple cert uploads
busRouter.put('/profile/:businessId', upload.fields([
  { name: 'hygieneCert', maxCount: 1 },
  { name: 'businessLicense', maxCount: 1 },
  { name: 'halalCert', maxCount: 1 },
  { name: 'backgroundImage', maxCount: 1 }
]), async (req, res, next) => {
  const { businessId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(businessId)) {
    return res.status(400).json({ success: false, message: "Invalid businessId" });
  }
  return updateBusinessProfile(req, res, next);
});

// Get business by email
busRouter.get('/business-by-email/:email', async (req, res) => {
  try {
    const business = await businessModel.findOne({ email: req.params.email });
    if (business) {
      res.json({ success: true, business });
    } else {
      res.json({ success: false, message: "Business not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching business" });
  }
});

busRouter.patch('/orders/:orderId/remove', removeCompletedOrder);

export default busRouter;


