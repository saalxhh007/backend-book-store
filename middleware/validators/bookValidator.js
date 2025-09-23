import { body } from "express-validator";

const bookValidation = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").optional().isString(),
  body("isbn").optional().isString(),
  body("language").optional().isString(),
  body("author").optional().isString(),
  body("publisher").optional().isString(),
  body("publication_date").optional().isString(),
  body("price").isNumeric().withMessage("Price must be a number"),
  body("originalPrice").isNumeric().optional(),
  body("categoriesIds").optional().isArray().withMessage("Categories must be an array of IDs"),
]

export default bookValidation