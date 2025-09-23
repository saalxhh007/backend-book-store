import { DataTypes } from "sequelize"
import db from "./../config/db.js"
import Book from "./book/BookModel.js"
import User from "./userModel.js"

const CartItem = db.define("CartItem", {
  id: {
    type: DataTypes.UUID,
    defaultValue: db.Sequelize.literal("gen_random_uuid()"),
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  book_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false,
  },
  price_snapshot: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  added_at: {
    type: DataTypes.DATE,
    defaultValue: db.Sequelize.literal("NOW()"),
  },
}, {
  tableName: "cart_items",
  timestamps: false,
})

CartItem.belongsTo(Book, { foreignKey: "book_id", as: "book" })
CartItem.belongsTo(User, { foreignKey: "user_id", as: "user" })

export default CartItem