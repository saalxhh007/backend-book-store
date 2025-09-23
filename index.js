import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import db from "./config/db.js";

import userRouter from "./routes/user.router.js";
import addressRouter from "./routes/address.router.js";
import bookRoutes from "./routes/book.routes.js";
import CartRouter from "./routes/cart.routes.js";
import WishlistRouter from "./routes/wishlist.router.js";
import EventRouter from "./routes/event.router.js";
import dashboardRouter from "./routes/dashboard.router.js";
import orderRouter from "./routes/order.router.js";
import profileRouter from "./routes/profile.router.js";
import complaintRouter from "./routes/complaint.router.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/users", userRouter);
app.use("/api/addresses", addressRouter);
app.use("/api/books", bookRoutes);
app.use("/api/cart", CartRouter);
app.use("/api/wishlist", WishlistRouter);
app.use("/api/orders", orderRouter);
app.use("/api/events", EventRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/profile", profileRouter);
app.use("/api/complaint", complaintRouter);

// Root test route
app.get("/", (req, res) => {
  res.send("Hello from API 👋");
});

// DB connection + server start
(async () => {
  try {
    await db.authenticate();
    console.log("✅ Database connected!");

    await db.sync({ alter: true });
    console.log("✅ All tables created/updated!");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1); // exit with error if DB fails
  }
})();
