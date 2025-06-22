import { getOpenOrClosed, getOrdersForBusiness, openOrClosed, updateOrderStatus } from '../controllers/businessController.js';
import express from 'express'

const busRouter = express.Router();

busRouter.post('/openOrClosed', openOrClosed)
busRouter.get('/status/:id', getOpenOrClosed)
busRouter.get('/orders/:businessId', getOrdersForBusiness)
busRouter.patch('/orders/:orderId/status', updateOrderStatus)

export default busRouter;
