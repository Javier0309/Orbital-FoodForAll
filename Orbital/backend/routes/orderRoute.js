import express from 'express'
import verifyUser from '../middleware/verifyUser.js'
import { placeOrder } from '../controllers/orderController.js';


const orderRoute = express.Router();

orderRoute.post('/place', verifyUser, placeOrder);

export default orderRoute;