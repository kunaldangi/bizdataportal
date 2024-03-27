import { Sequelize, DataTypes } from "sequelize";

export function initializeTablesModel(sequelize: Sequelize){
    return sequelize.define('tables', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            unique: true,
            primaryKey: true
        },
        ownerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        name: {
            type: DataTypes.STRING(36),
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        fields: {
            type: DataTypes.JSON,
            defaultValue: []
        }
    });
}