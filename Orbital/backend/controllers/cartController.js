import { supabase } from '../SupabaseClient.js';
import userModel from '../models/userModel.js';

// add items to user cart
const addToCart = async (req, res) => {
    try {
        const {email} = req.user;
        const {itemId} = req.body;

        let user = await userModel.findOne({email: req.user.email});
        if (!user){
            user = await userModel.create({
                email: req.user.email,
                cartData: {}
            })
        }

        const cart = user.cartData || {};
        cart[itemId] = (cart[itemId] || 0) + 1;

        await userModel.updateOne({email}, {cartData: cart})

        res.json({success: true, message:"Item added to cart"})
    } catch (error) {
        console.error("Add to cart error:", error);
        res.status(500).json({success:false, message:"Error adding to cart"})
    }
}

// remove items from user cart
const removeFromCart = async (req, res) => {
    try {
        const { email } = req.user;
        const { itemId } = req.body;

        let user = await userModel.findOne({ email: req.user.email });
        //if (!user) return res.status(404).json({ success: false, message: "User not found"})
        if (!user){
            user = await userModel.create({
                email: req.user.email,
                cartData: {}
            })
        }

        const cart = user.cartData || {};

        if (cart[itemId]) {
            if (cart[itemId] > 1){
                cart[itemId] -= 1;
            } else {
                delete cart[itemId];
            }
        }

        await userModel.updateOne({ email }, { cartData: cart });

        res.json({ success: true, message: "Item removed from cart"});
    } catch (error) {
        console.error("Remove from cart error:", error)
        res.status(500).json({success:false, message:"Error removing from cart"})
    }
}

// fetch user cart data
const getCart = async (req, res) => {
    try {
        const {email} = req.user;

        let user = await userModel.findOne({email: req.user.email});
        if (!user){
            user = await userModel.create({
                email: req.user.email,
                cartData: {}
            })
        }
    
        res.json({success: true, cartData: user.cartData || {} })
    } catch (error) {
        console.error("Fetch cart error:", error)
        res.status(500).json({success:false, message:"Error fetching cart"})
    }
}

export {addToCart, removeFromCart, getCart};