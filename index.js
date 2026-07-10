import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import path from "path"
import { fileURLToPath } from "url"
import db from "./config/db.js"

import userRouter from "./routes/user.router.js"
import addressRouter from "./routes/address.router.js"
import bookRoutes from "./routes/book.routes.js"
import CartRouter from "./routes/cart.routes.js"
import WishlistRouter from "./routes/wishlist.router.js"
import EventRouter from "./routes/event.router.js"
import dashboardRouter from "./routes/dashboard.router.js"
import orderRouter from "./routes/order.router.js"
import profileRouter from "./routes/profile.router.js"
import complaintRouter from "./routes/complaint.router.js"

dotenv.config()

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(morgan("dev"))
app.use(cookieParser())
app.use(express.json({limit: "20mb"}))
app.use(express.urlencoded({ limit: "10mb", extended: true }))

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.use("/api/users", userRouter)
app.use("/api/addresses", addressRouter)
app.use("/api/books", bookRoutes)
app.use("/api/cart", CartRouter)
app.use("/api/wishlist", WishlistRouter)
app.use("/api/orders", orderRouter)
app.use("/api/events", EventRouter)
app.use("/api/dashboard", dashboardRouter)
app.use("/api/profile", profileRouter)
app.use("/api/complaint", complaintRouter)

app.get("/", (req, res) => {
  res.send("Hello from API 👋");
});

const startServer = async () => {
  try {
    await db.authenticate()
    await db.sync()
    console.log("✅ Database connected")
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    })
  } catch (err) {
    console.error("❌ DB connection error:", err)
  }
}

startServer()