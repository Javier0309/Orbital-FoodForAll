import foodModel from "../models/foodModel.js";

export const getFullCartItems = async (cartData = {}) => {
    const foodIds = Object.keys(cartData);
    const foodItems = await foodModel.find({ _id: { $in: foodIds }});
    const detailedCart = foodItems.map(item => ({
        ...item.toObject(),
        quantity: cartData[item._id] || 0,
    }))

    return detailedCart;
}


export const groupCartByBusiness = (cartItems = []) => {
    const grouped = {};

    cartItems.forEach(item => {
        const businessId = item.businessId || "unknown";
        if (!grouped[businessId]) grouped[businessId] = [];
        grouped[businessId].push(item)
    })
    return grouped;
}