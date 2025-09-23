import express from "express"
import * as orderController from "./../controllers/order.controller.js"
import authMiddleware from "./../middleware/auth.middleware.js"
import roleMiddleware from "../middleware/role.middleware.js"

const orderRouter = express.Router()

orderRouter.post("/", authMiddleware, roleMiddleware("admin", "customer"), orderController.createOrder)
orderRouter.get("/", authMiddleware, roleMiddleware("admin"), orderController.getOrders)
orderRouter.get("/:id", authMiddleware, roleMiddleware("admin"), orderController.getOrderById)
orderRouter.get("/my/order", authMiddleware, roleMiddleware("customer"), orderController.getOrders)
orderRouter.get("/my/order/:order_id", authMiddleware, roleMiddleware("customer"), orderController.getMyOrder)
orderRouter.delete("/:id", authMiddleware, roleMiddleware("admin"), orderController.deleteOrder)
orderRouter.get("/shipping/info", authMiddleware, roleMiddleware("customer"), orderController.shippingInfo)
orderRouter.patch("/update/address", authMiddleware, roleMiddleware("customer"), orderController.updateAddress)
orderRouter.patch("/update/status", authMiddleware, roleMiddleware("admin"), orderController.updateStatus)


export default orderRouter