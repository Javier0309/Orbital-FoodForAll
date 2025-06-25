import express from 'express';
import multer from "multer";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";
import { getBusinessProfile, updateBusinessProfile } from '../controllers/businessController.js';

const busRouter = express.Router();

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
busRouter.get('/profile/:businessId', async (req, res, next) => {
  const { businessId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(businessId)) {
    return res.status(400).json({ success: false, message: "Invalid businessId" });
  }
  return getBusinessProfile(req, res, next);
});

busRouter.put('/profile/:businessId', upload.single("hygieneCert"), async (req, res, next) => {
  const { businessId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(businessId)) {
    return res.status(400).json({ success: false, message: "Invalid businessId" });
  }
  return updateBusinessProfile(req, res, next);
});

export default busRouter;


