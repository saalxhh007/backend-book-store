import express from "express"
import authMiddleware from "../middleware/auth.middleware.js"
import roleMiddleware from "../middleware/role.middleware.js"
import validate from "../middleware/validators/validator.js"
import { createBook, deleteBook, getBookById, getBooks, updateBook } from "../controllers/book.controller.js";
import bookValidation from "../middleware/validators/bookValidator.js"
import uploadBookImage from "../middleware/uploadImage.js";

const bookRouter = express.Router()

bookRouter.post("/", authMiddleware, roleMiddleware("admin"), uploadBookImage.single("cover_image"), bookValidation, validate, createBook)
bookRouter.get("/", getBooks)
bookRouter.get("/:id", getBookById)
bookRouter.patch("/:id", authMiddleware, roleMiddleware("admin"), updateBook)
bookRouter.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteBook)

export default bookRouter;
