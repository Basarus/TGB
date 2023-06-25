import { DataTypes } from "sequelize";
import sequlize from "../database.js";

export const recepts = sequlize.define('recepts', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    category: {type: DataTypes.STRING},
    src: { type: DataTypes.STRING, unique: true },
    show: {type: DataTypes.BOOLEAN, defaultValue: false}
})