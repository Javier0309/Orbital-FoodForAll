import { getOrdersForBusiness, updateOrderStatus } from '../controllers/businessController.js';
import express from 'express'
import verifyUser from '../middleware/verifyUser.js';

const busRouter = express.Router();

busRouter.get('/orders/:businessId', getOrdersForBusiness)
busRouter.patch('/orders/:orderId/status', updateOrderStatus)

export default busRouter;
