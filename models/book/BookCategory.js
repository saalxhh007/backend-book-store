import { DataTypes } from "sequelize";
import db from "../../config/db.js";

const BookCategory = db.define("BookCategory", {
  book_id: { type: DataTypes.UUID, allowNull: false },
  category_id: { type: DataTypes.INTEGER, allowNull: false },
}, {
  tableName: "book_categories",
  timestamps: false,
})

export default BookCategory