import express from "express"

import userController from "../controllers/user.controller.js"
import authMiddleware from "../middleware/auth.middleware.js"
import authService from "../services/auth.service.js";
import { loginValidation, signupValidation } from "../middleware/validators/authValidator.js";
import validate from "../middleware/validators/validator.js";
import User from "../models/userModel.js";
import { authLimiter } from "../middleware/rateLimit.middleware.js"
// import { csrfProtection } from "../middleware/csrf.middleware.js"

const userRouter = express.Router()

userRouter.post("/create-admin", userController.createAdmin)
// Public routes
userRouter.post("/signup", signupValidation, validate, userController.signup)
userRouter.get("/", userController.all)
userRouter.post("/login", loginValidation, validate, userController.login)
userRouter.post("/refresh", userController.refresh)
userRouter.get("/verify-email", async (req, res) => {
  try {
    await authService.verifyEmail( req.query.token);
    res.json({ message: "Email verified successfully" })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})
userRouter.post('/verify-whatsapp', async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ error: 'email and code are required' });
  }

  try {
    await authService.verifyWhatsAppCode(email.toLowerCase(), code);
    res.json({ message: 'WhatsApp verified successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
})


// Protected routes
userRouter.post("/logout", authLimiter, authMiddleware, userController.logout)

// admin routes
userRouter.delete("/delete/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByPk(userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        await user.destroy();
        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
})
// userRouter.patch("/", userController.update)
export default userRouter
