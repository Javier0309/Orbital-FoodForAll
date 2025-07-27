import express from 'express'
import businessModel from '../models/businessModel.js'
import custModel from '../models/customerModel.js';
import driverModel from '../models/driverModel.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const proofsDir = path.join(process.cwd(), 'uploads/proofs');
if (!fs.existsSync(proofsDir)) {
    fs.mkdirSync(proofsDir, { recursive: true });
}

const pfpDir = path.join(process.cwd(), 'uploads/pfp');
if (!fs.existsSync(pfpDir)) {
    fs.mkdirSync(pfpDir, { recursive: true });
}

const signupRouter = express.Router();

const busStorage = multer.diskStorage({
    destination: (req,file,cb) => cb(null, 'uploads/certs'),
    filename:(req,file,cb) => cb(null, `${Date.now()}-${file.originalname}`),
})
const busUpload = multer({storage: busStorage})

const custStorage = multer.diskStorage({
    destination: (req,file,cb) => cb(null, 'uploads/proofs'),
    filename:(req,file,cb) => cb(null, `${Date.now()}-${file.originalname}`),
})
const custUpload = multer({storage: custStorage})

const driverStorage = multer.diskStorage({
    destination: (req,file,cb) => cb(null, 'uploads/pfp'),
    filename:(req,file,cb) => cb(null, `${Date.now()}-${file.originalname}`),
})
const driverUpload = multer({storage: driverStorage})


signupRouter.post('/create-business', 
    busUpload.fields([{name: 'hygieneCert'}, {name: 'businessLicense'}, {name: 'halalCert'}]),
    async (req, res) => {
    try {
        const { name, email, address, userId, phone } = req.body;
        if (!name || !email || !address || !userId || !phone){
            return res.status(400).json({ success: false, message: "Missing name, email, address, userId, or phone" })
        }

        const existing = await businessModel.findOne( {email});
        if (existing) {
            return res.status(200).json({ success: true, businessId: existing._id })
        }

        const newBusiness = await businessModel.create({ name, email, address, userId, phone, isVerified: false, 
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

signupRouter.patch('/verify/business/:businessId', async (req, res) => {
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


signupRouter.post('/create-customer', 
    custUpload.single('proofOfNeed'),
    async (req, res) => {
    try {
        const { name, email, address, phone, userId, dietaryNeeds } = req.body;
        if (!name || !email || !phone || !address || !userId || !dietaryNeeds){
            return res.status(400).json({ success: false, message: "Missing required fields" })
        }

        const existing = await custModel.findOne( {email});
        if (existing) {
            return res.status(200).json({ success: true, customerId: existing._id })
        }

        const newCustomer = await custModel.create({ userType:'customer', name, email, phone, address, userId, dietaryNeeds, isVerified: false, 
            proofOfNeedUrl: req.file ? `/uploads/proofs/${req.file.filename}` : null,
        });

        
        res.status(201).json({ success: true, customerId: newCustomer._id })

    } catch (error) {
        console.error("Error creating customer:", error);
        res.status(500).json( {success: false, message: "Server error"})
    }
})

signupRouter.get('/customer-by-email/:email', async (req, res) => {
    try {
        const customer = await custModel.findOne({ email: req.params.email });
        if (customer) {
            res.json({ success: true, customer });
        } else {
            res.json({ success: false, message: "Customer not found" });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
});

signupRouter.patch('/verify/customer/:customerId', async (req, res) => {
    try {
        const {customerId} = req.params;
        const customer = await custModel.findByIdAndUpdate(
            customerId, {isVerified:true}, {new:true}
        );
        if (!customer) {
            return res.status(404).json({success: false, message: 'Customer not found'})
        }
        res.json({success: true, message: 'Customer verified', customer})
    } catch (error) {
        console.error("Error verifying customer:", error);
        res.status(500).json( {success: false, message: "Server error"})
    }
})

signupRouter.post('/create-driver',
    driverUpload.single('profilePicture'),

    async (req, res) => {
    try {
        const { name, email, phone, userId, userType, vehicleType, licensePlate } = req.body;
        if (!name || !email || !phone || !userId || !userType || !vehicleType || !licensePlate){
            return res.status(400).json({ success: false, message: "Missing fields" })
        }

        const existing = await driverModel.findOne( {email});
        if (existing) {
            return res.status(200).json({ success: true, driverId: existing._id })
        }

        const newDriver = await driverModel.create({ name, email, phone, userId, userType, vehicleType, licensePlate,
            profilePicUrl: req.file ? `/uploads/pfp/${req.file.filename}` : null
         });

        res.status(201).json({ success: true, driverId: newDriver._id })

    } catch (error) {
        console.error("Error creating driver:", error);
        res.status(500).json( {success: false, message: "Server error"})
    }
})

signupRouter.get('/driver-by-email/:email', async (req, res) => {
    try {
        const driver = await driverModel.findOne({ email: req.params.email });
        if (driver) {
            res.json({ success: true, driver });
        } else {
            res.json({ success: false, message: "Driver not found" });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
});



export default signupRouter;