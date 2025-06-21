import express from 'express'
import businessModel from '../models/businessModel.js'

const signupRouter = express.Router();

signupRouter.post('/create-business', async (req, res) => {
    try {
        const { name, email } = req.body;
        if (!name || !email ){
            return res.status(400).json({ success: false, message: "Missing name or email" })
        }

        const existing = await businessModel.findOne( {email});
        if (existing) {
            return res.status(200).json({ success: true, businessId: existing._id })
        }

        const newBusiness = await businessModel.create({ name, email });
        res.status(201).json({ success: true, businessId: newBusiness._id })

    } catch (error) {
        console.error("Error creating business:", error);
        res.status(500).json( {success: false, message: "Server error"})
    }
})

export default signupRouter;