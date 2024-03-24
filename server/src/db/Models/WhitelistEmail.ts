import { Sequelize, DataTypes } from "sequelize";

export function initializeWhitelistEmailModel(sequelize: Sequelize){
    return sequelize.define('whitelistEmail', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            unique: true,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        }
    });
}