
import express from 'express'
import verifyUser from '../middleware/verifyUser.js'
import { addToCart,removeFromCart,getCart } from '../controllers/cartController.js';

const cartRoute = express.Router();

cartRoute.post("/add", verifyUser, addToCart);
cartRoute.post("/remove", verifyUser, removeFromCart)
cartRoute.get("/", verifyUser, getCart)

export default cartRoute;