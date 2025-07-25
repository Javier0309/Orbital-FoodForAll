import express from 'express'
import verifyUser from '../middleware/verifyUser.js'
import { getOrderById, getAssignedOrdersForDriver, 
        placeOrder, assignDriverToOrder, updateDeliveryStatus, 
        getAvailableOrdersForDelivery, selfAssignOrder, getCustomerCurrentOrder, removeOrderForDriver, removeOrderForCustomer, switchOrderToPickup, getDeliveredOrdersForDriver, getCustomerOrderHistory } from '../controllers/orderController.js';


const orderRoute = express.Router();

orderRoute.post('/place', verifyUser, placeOrder);
orderRoute.post('/assign-driver', assignDriverToOrder)
orderRoute.post('/driver/update-status', updateDeliveryStatus)
orderRoute.post('/driver/available-orders', getAvailableOrdersForDelivery)
orderRoute.post('/driver/self-assign', selfAssignOrder)
orderRoute.patch('/driver/remove/:orderId', removeOrderForDriver)
orderRoute.patch('/customer/remove/:orderId', removeOrderForCustomer)
orderRoute.patch('/:orderId/switch-to-pickup', switchOrderToPickup);
orderRoute.get('/driver/assigned/:driverId', getAssignedOrdersForDriver)
orderRoute.get('/driver/delivered/:driverId', getDeliveredOrdersForDriver);
orderRoute.get('/:orderId', getOrderById)
orderRoute.get('/customer-current/:email', getCustomerCurrentOrder)
orderRoute.get('/customer-history/:email', getCustomerOrderHistory)

export default orderRoute;