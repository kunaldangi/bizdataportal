import { Sequelize, DataTypes } from "sequelize";

export function initializeUserModel(sequelize: Sequelize){
    return sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            unique: true,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING(36),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        level: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        permissions: {
            type: DataTypes.JSON,
            defaultValue: `{"usersAcc":{"manage":false,"managePermissions":false,"manageWhitelist":false},"tables":{"create":false,"read":false,"writeIn":false,"manage":false,"manageUserPermissions":false}}`
        }
    });
}