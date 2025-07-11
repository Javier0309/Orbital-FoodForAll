import express from 'express'
import verifyUser from '../middleware/verifyUser.js'
import { getOrderById, getAssignedOrdersForDriver, 
        placeOrder, assignDriverToOrder, updateDeliveryStatus, 
        getAvailableOrdersForDelivery, selfAssignOrder, getCustomerCurrentOrder } from '../controllers/orderController.js';


const orderRoute = express.Router();

orderRoute.post('/place', verifyUser, placeOrder);
orderRoute.post('/assign-driver', assignDriverToOrder)
orderRoute.post('/driver/update-status', updateDeliveryStatus)
orderRoute.post('/driver/available-orders', getAvailableOrdersForDelivery)
orderRoute.post('/driver/self-assign', selfAssignOrder)
orderRoute.get('/driver/assigned/:driverId', getAssignedOrdersForDriver)
orderRoute.get('/:orderId', getOrderById)
orderRoute.get('/customer-current/:email', getCustomerCurrentOrder)

export default orderRoute;