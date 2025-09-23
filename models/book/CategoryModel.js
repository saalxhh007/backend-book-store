import { DataTypes } from "sequelize"
import db from "./../../config/db.js"

const Category = db.define("Category", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  slug: { type: DataTypes.STRING, allowNull: false, unique: true },
  description: { type: DataTypes.TEXT },
}, {
  tableName: "categories",
  timestamps: false,
})

export default Category