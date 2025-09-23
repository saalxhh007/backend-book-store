import express from "express"

// import authMiddleware from "../middleware/auth.middleware.js"
import {
    getOrdersStats,
    getRevenueStats,
    getActiveCustomersStats,
    getAvgConfirmationTime,
    getSalesData,
    getCategoryRevenueStats,
    getBestSellings,
    getCustomerDistributionByState,
    getTotalCustomers
} from "../controllers/dashboard.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
    
const dashboardRouter = express.Router();

// CartRouter.use(authMiddleware)

dashboardRouter.get("/total-orders", authMiddleware, roleMiddleware("admin"), getOrdersStats)
dashboardRouter.get("/total-revenue", authMiddleware, roleMiddleware("admin"), getRevenueStats)
dashboardRouter.get("/active-users", authMiddleware, roleMiddleware("admin"), getActiveCustomersStats)
dashboardRouter.get("/confirmation-time", authMiddleware, roleMiddleware("admin"), getAvgConfirmationTime)
dashboardRouter.get("/sales-data", authMiddleware, roleMiddleware("admin"), getSalesData)
dashboardRouter.get("/category-revenue", authMiddleware, roleMiddleware("admin"), getCategoryRevenueStats)
dashboardRouter.get("/best-sellings", authMiddleware, roleMiddleware("admin"), getBestSellings)
dashboardRouter.get("/customers-by-state", authMiddleware, roleMiddleware("admin"), getCustomerDistributionByState)
dashboardRouter.get("/all-customers", authMiddleware, roleMiddleware("admin"), getTotalCustomers)

export default dashboardRouter