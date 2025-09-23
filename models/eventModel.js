import { DataTypes } from "sequelize";
import db from "./../config/db.js"

const Event = db.define("Event", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: db.literal("gen_random_uuid()")
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  book_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  order_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  session_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ip: {
    type: DataTypes.STRING,
    allowNull: true
  },
  user_agent: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: "events",
  timestamps: false
})

export default Event