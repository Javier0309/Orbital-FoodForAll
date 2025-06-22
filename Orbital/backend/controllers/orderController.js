import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import foodModel from "../models/foodModel.js";
import { getFullCartItems, groupCartByBusiness } from "../utils/cartUtils.js";

const placeOrder = async (req, res) => {
    try {
        const { email } = req.user;
        const user = await userModel.findOne({email});
        const cartData = user?.cartData || {}
    
        if (Object.keys(cartData).length === 0){
            return res.status(400).json({ success: false, message: "Cart is empty"})
        }

        const fullCartItems = await getFullCartItems(cartData);
        const groupedByBusiness = groupCartByBusiness(fullCartItems);

        const createdOrders = [];

        for (const [businessId, items] of Object.entries(groupedByBusiness)) {
            const order = await orderModel.create({
                customerEmail: email,
                businessId, 
                items: items.map(i => ({
                    foodId: i._id,
                    name: i.name,
                    quantity: i.quantity,
                    image: i.image
                }))
            })
            // minus off the food ordered from the orignal quantity
        for (const item of items){
            const food = await foodModel.findById(item._id)
            if (food && food.quantity >= item.quantity) {
                await foodModel.updateOne(
                    {_id: item._id},
                    {$inc: { quantity: -item.quantity }}
                )
            } else {
                return res.status(400).json({success: false, message: `Not enough quantity for ${item.name}`})
            }
        }
            createdOrders.push(order);
        }

        // Clear user cart
        await userModel.updateOne({email}, {cartData: {}})
        

        res.json({ success: true, message: "Order(s) placed", orders: createdOrders})
    } catch (error) {
        console.error("Place order error:", error);
        res.status(500).json({success: false, message: "Error placing order"})
    }
}

export { placeOrder };