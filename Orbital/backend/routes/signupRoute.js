import express from 'express'
import businessModel from '../models/businessModel.js'
import multer from 'multer';
import path from 'path';

const signupRouter = express.Router();

const storage = multer.diskStorage({
    destination: (req,file,cb) => cb(null, 'uploads/certs'),
    filename:(req,file,cb) => cb(null, `${Date.now()}-${file.originalname}`),
})
const upload = multer({storage})

signupRouter.post('/create-business', 
    upload.fields([{name: 'hygieneCert'}, {name: 'businessLicense'}, {name: 'halalCert'}]),
    async (req, res) => {
    try {
        const { name, email, address, userId } = req.body;
        if (!name || !email || !address || !userId){
            return res.status(400).json({ success: false, message: "Missing name or email" })
        }

        const existing = await businessModel.findOne( {email});
        if (existing) {
            return res.status(200).json({ success: true, businessId: existing._id })
        }

        const newBusiness = await businessModel.create({ name, email, address, userId, isVerified: false, 
            hygieneCertUrl: 
                req.files.hygieneCert?.[0]?.path ? `/uploads/certs/${req.files.hygieneCert[0].filename}` : null,
            businessLicenseUrl:
                req.files.businessLicense?.[0]?.path ? `/uploads/certs/${req.files.businessLicense[0].filename}` : null,
            halalCertUrl:
                req.files.halalCert?.[0]?.path ? `/uploads/certs/${req.files.halalCert[0].filename}` : null,
         });

        await newBusiness.save();
        res.status(201).json({ success: true, businessId: newBusiness._id })

    } catch (error) {
        console.error("Error creating business:", error);
        res.status(500).json( {success: false, message: "Server error"})
    }
})

signupRouter.get('/business-by-email/:email', async (req, res) => {
    try {
        const business = await businessModel.findOne({ email: req.params.email });
        if (business) {
            res.json({ success: true, business });
        } else {
            res.json({ success: false, message: "Business not found" });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
});

signupRouter.patch('/verify/:businessId', async (req, res) => {
    try {
        const {businessId} = req.params;
        const business = await businessModel.findByIdAndUpdate(
            businessId, {isVerified:true}, {new:true}
        );
        if (!business) {
            return res.status(404).json({success: false, message: 'Business not found'})
        }
        res.json({success: true, message: 'Business verified', business})
    } catch (error) {
        console.error("Error verifying business:", error);
        res.status(500).json( {success: false, message: "Server error"})
    }
})



export default signupRouter;