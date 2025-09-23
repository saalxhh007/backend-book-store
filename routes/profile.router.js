import express from "express"
import * as profileController from "./../controllers/profile.controller.js"
import authMiddleware from "./../middleware/auth.middleware.js"
import roleMiddleware from "../middleware/role.middleware.js"

const profileRouter = express.Router()

profileRouter.use(authMiddleware)
profileRouter.use(roleMiddleware("customer"))

profileRouter.get("/my-profile", profileController.getMyProfile)
profileRouter.get("/recomendations", profileController.getRecomendations)
profileRouter.get("/order-history", profileController.getOrderHistory)
// profileRouter.get("/my-reviews", profileController.getMyReviews)
profileRouter.patch("/update-password", profileController.PatchUpdatePassword)
profileRouter.patch("/update-email", profileController.PatchUpdateEmail)
// profileRouter.patch("/update-address", profileController.updateAddress)

export default profileRouter