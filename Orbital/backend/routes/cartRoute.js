
import express from 'express'
import verifyUser from '../middleware/verifyUser.js'
import { addToCart,removeFromCart,getCart, updateCartComment } from '../controllers/cartController.js';

const cartRoute = express.Router();

cartRoute.post("/add", verifyUser, addToCart);
cartRoute.post("/remove", verifyUser, removeFromCart)
cartRoute.post("/update-comment", verifyUser, updateCartComment)
cartRoute.get("/", verifyUser, getCart)

export default cartRoute;