import { DataTypes } from "sequelize";
import db from "./../../config/db.js"

const Book = db.define("Book", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  author: { type: DataTypes.STRING, defaultValue: "Unknown" },
  description: { type: DataTypes.TEXT },
  isbn: { type: DataTypes.STRING, unique: true },
  language: { type: DataTypes.STRING },
  publisher: { type: DataTypes.STRING },
  publication_date: { type: DataTypes.DATE },
  cover_image: { type: DataTypes.STRING },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  avg_rating: { type: DataTypes.FLOAT, defaultValue: 0 },
  rating_count: { type: DataTypes.INTEGER, defaultValue: 0 },
}, {
  tableName: "books",
  timestamps: false,
})

export default Book