import { DataTypes, Sequelize } from "sequelize";
import db from "./../config/db.js"

const Address = db.define("Address", {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.literal('gen_random_uuid()'),
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  line1: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  line2: {
    type: DataTypes.STRING,
  },
  state: {
    type: DataTypes.STRING,
  },
  district: {
    type: DataTypes.STRING,
  },
  municipality: {
    type: DataTypes.STRING,
  },
}, {
  tableName: "addresses",
  timestamps: false,
})

export default Address