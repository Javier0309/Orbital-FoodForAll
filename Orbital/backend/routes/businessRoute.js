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

// Support multiple cert uploads: hygieneCert, businessLicense, halalCert
busRouter.put(
  '/profile/:userId', 
  upload.fields([
    { name: "hygieneCert", maxCount: 1 },
    { name: "businessLicense", maxCount: 1 },
    { name: "halalCert", maxCount: 1 }
  ]),
  async (req, res, next) => {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid userId" });
    }
    return updateBusinessProfile(req, res, next);
  }
);

export default busRouter;


