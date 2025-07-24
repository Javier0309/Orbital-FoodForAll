import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import foodModel from "../models/foodModel.js";
import driverModel from "../models/driverModel.js";
import { getFullCartItems, groupCartByBusiness } from "../utils/cartUtils.js";

const placeOrder = async (req, res) => {
    try {
        const { email } = req.user;
        const { deliveryMode = 'pickup', location, customerEmail } = req.body
        
        // Use provided customerEmail or fall back to logged-in user's email
        const orderCustomerEmail = customerEmail || email;
        
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
                customerEmail: orderCustomerEmail,
                businessId, 
                items: items.map(i => ({
                    foodId: i._id,
                    name: i.name,
                    quantity: i.quantity,
                    comment: i.comment,
                    image: i.image
                })), 
                deliveryMode, ...(deliveryMode === 'delivery' && location ? { location } : {})
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

const getOrderById = async (req, res) => {
    try {
        const {orderId} = req.params;
        const order = await orderModel.findById(orderId).populate('businessId', 'name address')

        if (!order) return res.status(404).json({ success: false, message: "Order not found"})
        res.json({ success: true, order})

    } catch (error) {
        res.status(500).json({success: false, message: "Error fetching order"})
    }
}

const assignDriverToOrder = async (req, res) => {
    try {
        const {driverId, orderId} = req.body;

        const order = await orderModel.findById(orderId);
        if (!order) return res.status(400).json({ success: false, message: "Order not found"})
        if (order.deliveryStatus !== 'pending') {
            return res.status(400).json({ success: false, message: "Order already assigned or delivered"})
        }

        const driver = await driverModel.findById(driverId);
        if (!driver || !driver.isAvailable) {
            return res.status(400).json({ success: false, message: "Driver not available"})
        }

        order.driverId = driverId;
        order.deliveryStatus = 'assigned';
        await order.save();

        driver.isAvailable = false;
        await driver.save();

        res.json({ success: true, message: 'Driver assigned successfully', order})

    } catch (error) {
        res.status(500).json({success: false, message: "Error assigning driver"})
    }
}

const updateDeliveryStatus = async (req, res) => {
    try {
        // 1. make function in controller, export
        // 2. route: orderRoute.post('/driver/update-status', updateDeliveryStatus)
        // 3. frontend: params for await API.post('/orders/driver/update-status' {driverId, orderId, newStatus})
        const { driverId, orderId, newStatus } = req.body;

        const validTransitions = ['assigned', 'in_transit', 'delivered'];

        if (!validTransitions.includes(newStatus)) {
            return res.status(400).json({ success: false, message: "Invalid delivery status"})
        }

        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found"})
        }

        if (String(order.driverId) !== driverId){
            return res.status(403).json({ success: false, message: "You are not assigned to this order"})
        }

        order.deliveryStatus = newStatus;
        await order.save();

        if (newStatus === 'delivered'){
            await driverModel.findByIdAndUpdate(driverId, { isAvailable: true})
        }

        res.json({ success: true, message: `Order marked as ${newStatus}`, order})
    } catch (error ){
        console.error("Delivery status update error:", error);
        res.status(500).json({success: false, message: "Error updating delivery status"})
    }
}

const getAvailableOrdersForDelivery = async (req, res) => {
    try {
        const availableOrders = await orderModel.find({
            deliveryMode: "delivery",
            deliveryStatus: "pending",
            driverId: null,
            status: { $ne: 'rejected' }
        }).populate('businessId', 'name address')
        res.json({success: true, orders: availableOrders})
    } catch (error) {
        console.error("Error fetching available orders:", error);
        res.status(500).json({success: false, message: "Error fetching available orders"})
    }
}

const selfAssignOrder = async (req,res) => {
    try {
        const {driverId, orderId} = req.body;

        // validate driver
        const driver = await driverModel.findById(driverId);
        if (!driver || !driver.isAvailable) {
            return res.status(400).json({ success: false, message: "Driver not available or not found"})
        }

        // validate order
        const order = await orderModel.findById(orderId);
        if (!order || order.deliveryStatus !== 'pending' || order.driverId) {
            return res.status(400).json({ success: false, message: "Order not available for assignment"})
        }

        // assign order
        order.driverId = driverId;
        order.deliveryStatus = 'assigned';
        await order.save()

        // set driver unavailable
        driver.isAvailable = false;
        await driver.save()

        res.json({ success: true, message: 'Order self-assigned successfully', order})

    } catch (error) {
        console.error("Self-assignment error:", error);
        res.status(500).json({success: false, message: "Error assigning order"})
    }
}

const getAssignedOrdersForDriver = async (req, res) => {
    try {
        const { driverId } = req.params;

        const orders = await orderModel.find({
            driverId, deliveryStatus: { $ne: 'delivered'}
        }).populate('businessId', 'name address')

        res.json({success: true, orders})
    } catch (error) {
        console.error("Error fetching driver's assigned orders:", error);
        res.status(500).json({success: false, message: "Error fetching assigned orders"})
    }
}

const getCustomerCurrentOrder = async (req, res) => {
    try {
        const {email} = req.params

        const order = await orderModel.findOne({
            customerEmail: email,
            deliveryStatus: { $in: ['pending', 'assigned', 'in_transit']}
        }).sort({ createdAt: -1})

        if (order){
            res.json({success:true, order})
        } else {
            res.json({success:false, message: 'No active order found'})
        }
    } catch ( error) {
        res.status(500).json({success: false, message: error.message})
    }
}

// Remove order for driver
const removeOrderForDriver = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await orderModel.findById(orderId);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        order.removedByDriver = true;
        await order.save();
        res.json({ success: true, message: 'Order removed for driver' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Remove order for customer
const removeOrderForCustomer = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await orderModel.findById(orderId);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        order.removedByCustomer = true;
        await order.save();
        res.json({ success: true, message: 'Order removed for customer' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Switch order to pickup mode
const switchOrderToPickup = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await orderModel.findById(orderId);
        if (!order) return res.status(404).json({ message: 'Order not found' });
        order.deliveryMode = 'pickup';
        order.deliveryStatus = 'pending';
        order.driverId = null;
        await order.save();
        res.json({ success: true, message: 'Order switched to pickup mode', order });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export { placeOrder,
        getOrderById,
        assignDriverToOrder, 
        updateDeliveryStatus, 
        getAvailableOrdersForDelivery, 
        selfAssignOrder,
        getAssignedOrdersForDriver, 
        getCustomerCurrentOrder,
        removeOrderForDriver,
        removeOrderForCustomer,
        switchOrderToPickup
        };