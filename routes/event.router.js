import express from "express"
import { getEvents, getPopularBooks, getRecommendations, logBookPurchase, logBookView, logEvent } from "../controllers/event.controller.js";
import authMiddleware from "../middleware/auth.middleware.js"

const EventRouter = express.Router()

EventRouter.post("/", logEvent)
EventRouter.get("/", getEvents)

EventRouter.post("/books/view", logBookView)
EventRouter.post("/books/purchase", logBookPurchase)

EventRouter.get("/books/popular", getPopularBooks)
EventRouter.get("/books/:bookId/recommendations", getRecommendations)

export default EventRouter