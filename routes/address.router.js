import express from "express"
import authMiddleware from "../middleware/auth.middleware.js"
import adressController from "../controllers/address.controller.js"
import roleMiddleware from "../middleware/role.middleware.js"

const AddressRouter = express.Router()

AddressRouter.post("/", authMiddleware, roleMiddleware("customer", "admin"), adressController.createAddress)
AddressRouter.get("/my", authMiddleware, roleMiddleware("customer"), adressController.getMyAddresses)
AddressRouter.put("/:id", authMiddleware, roleMiddleware("customer", "admin"), adressController.updateAddress)
AddressRouter.delete("/:id", authMiddleware, roleMiddleware("customer", "admin"), adressController.deleteAddress)
AddressRouter.get("/all", authMiddleware, roleMiddleware("admin"), adressController.allAdresses)

export default AddressRouter
