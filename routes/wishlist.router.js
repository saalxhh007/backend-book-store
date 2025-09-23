import express from "express"
import authMiddleware from "../middleware/auth.middleware.js"
import { addToWishlist, clearWishlist, getWishlist, removeFromWishlist } from "../controllers/wishlist.controller.js"
import roleMiddleware from "../middleware/role.middleware.js"

const WishlistRouter = express.Router()

WishlistRouter.use(authMiddleware)
WishlistRouter.use(roleMiddleware("customer"))

WishlistRouter.post("/", addToWishlist)
WishlistRouter.get("/", getWishlist)
WishlistRouter.delete("/:id", removeFromWishlist)
WishlistRouter.delete("/", clearWishlist)

export default WishlistRouter