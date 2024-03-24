import { Sequelize, DataTypes } from "sequelize";

export function initializeTablesModel(sequelize: Sequelize){
    return sequelize.define('tables', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            unique: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(36),
            allowNull: false
        }
    });
}