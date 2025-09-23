import express from "express"

import { addToCart, getCart, removeFromCart, clearCart, updateQuantity } from "./../controllers/cart.controller.js"
import authMiddleware from "../middleware/auth.middleware.js"
import roleMiddleware from "../middleware/role.middleware.js";
    
const CartRouter = express.Router();

CartRouter.use(authMiddleware);
CartRouter.use(roleMiddleware("customer"));

CartRouter.post("/",  addToCart)
CartRouter.get("/", getCart)
CartRouter.put("/:id", updateQuantity)
CartRouter.delete("/:id", removeFromCart)
CartRouter.delete("/", clearCart)

export default CartRouter
