import { Sequelize, DataTypes } from "sequelize";

export function initializeTablePermissionsModel(sequelize: Sequelize){
    return sequelize.define('tablePermissions', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            unique: true,
            primaryKey: true
        },
        tableId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'tables',
                key: 'id'
            }
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        permissions: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: {writeEntry:false, manageRows:false, manageFields:false, manageTable:false, manageUsers:false}
        }
    }, {
        indexes: [
            {
                unique: true,
                fields: ['tableId', 'userId']
            }
        ]
    });
}