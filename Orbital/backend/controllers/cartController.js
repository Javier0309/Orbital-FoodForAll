import { supabase } from '../SupabaseClient.js';
import userModel from '../models/userModel.js';
import foodModel from '../models/foodModel.js';
import { getFullCartItems } from '../utils/cartUtils.js';

// add items to user cart
const addToCart = async (req, res) => {
    try {
        const {email} = req.user;
        const {itemId, comment} = req.body;

        // Check if food item exists and has sufficient quantity
        const foodItem = await foodModel.findById(itemId);
        if (!foodItem) {
            return res.status(404).json({success: false, message: "Food item not found"});
        }

        let user = await userModel.findOne({email: req.user.email});
        if (!user){
            user = await userModel.create({email: req.user.email, cartData: {}})
        }

        const cart = user.cartData || {};
        const currentCartQuantity = cart[itemId]?.quantity || 0;

        // Check if adding this item would exceed available quantity
        if (currentCartQuantity + 1 > foodItem.quantity) {
            return res.status(400).json({success: false, message: `Cannot add more items. Only ${foodItem.quantity} available.`});
        }

        cart[itemId] = {quantity: currentCartQuantity + 1, comment: comment || cart[itemId]?.comment || ''};

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

        if (cart[itemId]?.quantity) {
            if (cart[itemId]?.quantity > 1){
                cart[itemId].quantity -= 1;
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

        let user = await userModel.findOne({email});
        if (!user) user = await userModel.create({email, cartData: {}})
    
        res.json({success: true, cartData: user.cartData })
    } catch (error) {
        console.error("Fetch cart error:", error)
        res.status(500).json({success:false, message:"Error fetching cart"})
    }
}

export {addToCart, removeFromCart, getCart};