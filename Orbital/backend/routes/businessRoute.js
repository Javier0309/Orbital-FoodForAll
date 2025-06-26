import { 
  getOpenOrClosed, 
  getOrdersForBusiness, 
  openOrClosed, 
  updateOrderStatus, 
  getBusinessProfile, 
  updateBusinessProfile 
} from '../controllers/businessController.js';
import express from 'express';
import multer from "multer";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";

const busRouter = express.Router();

busRouter.post('/openOrClosed', openOrClosed);
busRouter.get('/status/:id', getOpenOrClosed);
busRouter.get('/orders/:businessId', getOrdersForBusiness);
busRouter.patch('/orders/:orderId/status', updateOrderStatus);

const certsDir = path.join('uploads', 'certs');
if (!fs.existsSync(certsDir)) {
    fs.mkdirSync(certsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/certs/"),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Business profile routes
busRouter.get('/profile/:userId', async (req, res, next) => {
  const { userId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ success: false, message: "Invalid userId" });
  }
  return getBusinessProfile(req, res, next);
});

busRouter.put('/profile/:businessId', upload.fields([{name: 'hygieneCert'}, {name: 'businessLicense'}, {name: 'halalCert'}]), async (req, res, next) => {
  const { businessId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(businessId)) {
    return res.status(400).json({ success: false, message: "Invalid businessId" });
  }
  return updateBusinessProfile(req, res, next);
});

busRouter.get('/business-by-email/:email', async (req, res) => {
  try {
    const Business = (await import('../models/businessModel.js')).default;
    const business = await Business.findOne({ email: req.params.email });
    if (business) {
      res.json({ success: true, business });
    } else {
      res.json({ success: false, message: "Business not found" });
    }
    return updateBusinessProfile(req, res, next);
  }
);

export default busRouter;


