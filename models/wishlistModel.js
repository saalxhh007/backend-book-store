import { DataTypes } from "sequelize"
import db from "../config/db.js"

const Wishlist = db.define("Wishlist", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
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
  added_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "wishlists",
  timestamps: false
})

export default Wishlist