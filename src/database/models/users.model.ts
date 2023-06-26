import { DataTypes } from "sequelize";
import sequlize from "../database.js";

export const users = sequlize.define('users', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: {type: DataTypes.INTEGER, unique: true},
    donate: { type: DataTypes.INTEGER, defaultValue: 0},
    auth: { type: DataTypes.BOOLEAN, defaultValue: true},
})