import { DataTypes } from "sequelize";
import db from "../config/db.js";

const OrderItem = db.define("OrderItem", {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    order_id: { type: DataTypes.UUID },
    book_id: { type: DataTypes.UUID },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    unit_price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    total_price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
    title_snapshot: { type: DataTypes.TEXT }
}, {
    tableName: "order_items",
    timestamps: false,
})

export default OrderItem