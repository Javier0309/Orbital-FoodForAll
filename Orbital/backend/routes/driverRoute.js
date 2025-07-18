import multer from 'multer'
import path from 'path'
import driverModel from '../models/driverModel.js';
import userModel from '../models/userModel.js';
import express from 'express'
import mongoose from 'mongoose'

const router = express.Router();
//image storing engine
const storage = multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{
        return cb(null, `${Date.now()}${file.originalname}`)  //makes every filename unique
    }
})

const upload = multer({storage})

router.post('/drivers/:id/upload-profile-pic', upload.single('profilePic'), async (req, res) => {
    try {
        const filePath = `/uploads/${req.file.filename}`;
        const driver = await driverModel.findByIdAndUpdate(
            req.params.id, { profilePicUrl: filePath }, { new: true }
        )
        res.json({ success: true, profilePicUrl: filePath})
    } catch (error) {
        console.error("Profile pic upload error", error);
        res.status(500).json({ success: false, message: "Upload failed"})
    }
})

router.get('/drivers/:id', async (req, res) => {
    
    try {
        const driver = await driverModel.findById( req.params.id );
        if (!driver) return res.status(404).json({ success: false, message: "Driver not found" });
        res.json({ success: true, driver });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error" });
    }
})

router.put('/drivers/:id/about', async (req, res) => {
    try {
        const { about } = req.body;
        const driver = await driverModel.findByIdAndUpdate(
            req.params.id, {about}, {new:true}
        )

        if (!driver) return res.status(404).json({ success: false, message: "Driver not found" });
        res.json({ success: true, driver})
    } catch (error) {
        console.error("Update error", error);
        res.status(500).json({ success: false, message: "Update failed"})
    }
})

export default router;