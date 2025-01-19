import { Sequelize, DataTypes } from "sequelize";

export function initializeOtpModel(sequelize: Sequelize){
    return sequelize.define('otp', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            unique: true,
            primaryKey: true
        },
        type: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        code: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    });
}