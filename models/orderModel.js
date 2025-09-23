import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Order = db.define("Order", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: db.literal("gen_random_uuid()")
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    //
    order_number: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    total_amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    shipping_address_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    //
    billing_address_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    shipping_cost: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    tax_amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    payment_status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    placed_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    confirmed_at: {
        type: DataTypes.DATE,
    },
}, {
    tableName: "orders",
    timestamps: false
})

export default Order