import { Sequelize, DataTypes } from "sequelize";
import db from "../config/db.js";

const User = db.define("User", {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
    },
    email: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
    },
    password_hash: {
        type: DataTypes.TEXT,
    },
    full_name: {
        type: DataTypes.TEXT,
    },
    phone: {
        type: DataTypes.TEXT,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    is_email_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    is_phone_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    metadata: {
        type: DataTypes.JSONB,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn('now'),
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn('now'),
    },
    role: {
        type: DataTypes.TEXT,
        defaultValue: 'customer',
    },
    email_token: { type: DataTypes.STRING },
    refresh_token: { type: DataTypes.STRING },
}, {
    tableName: 'users',
    timestamps: false,
})

export default User