import { GraphQLError } from "graphql";

import { escapeIdPostgre } from "../../../lib/sqlString";

import { RowData, RowsData, Table, TableField, TablePermissions, TableUser } from "..";
import { Context } from "../../context";

import db from "../../../db";

export const Read = {
    Query: {
        getTable: async (_root: any, data: {id: number}, context: Context): Promise<Table> => { // Verified
            if (!context.auth) throw new GraphQLError('Unauthorized Access! Please login to continue.');
            try {
                let tablePerm: TablePermissions = (await db.tablePermissions.findOne({where: {tableId: data.id, userId: context.id}}))?.dataValues;
                if(!(context.permissions.tables.read || (tablePerm !== undefined))) throw new GraphQLError('You do not have permission to view this table.');
    
                const table = await db.tables.findByPk(data.id);
                if(table?.dataValues) return table?.dataValues;
                
                throw new GraphQLError('The table does not exist.');
            } catch (error: any) {
                throw new GraphQLError(error);
            }
        },
        getTables: async (_root: any, _:any, context: Context):Promise<Table[]> => { // Verified
            if (!context.auth) throw new GraphQLError('Unauthorized Access! Please login to continue.');
            try {
                if (context.permissions.tables.read){
                    const result = await db.tables.findAll(); // get all tables if user have permission to read all tables
                    if(result.length > 0) return result.map((table: any) => table.dataValues);
                }
                else {
                    const result: any = await db.tablePermissions.findAll({where: {userId: context.id}}); // get all tables that the user has access to read/view.
                    let tablesId: number[] = result.map((table: any) => table.dataValues.tableId);
                    let tablesResult = await db.tables.findAll({where: {id: tablesId}});
                    let tables: Table[] = tablesResult.map((table: any) => table.dataValues);
                    if(tables.length > 0) return tables;
                }
                throw new GraphQLError('No tables found!');
            } catch (error: any) {
                throw new GraphQLError(error);
            }
        },
        readTable: async (_root: any, data: {id: number}, context: Context):Promise<{id: number, rows: RowsData}> => {
            if (!context.auth) throw new GraphQLError('Unauthorized Access! Please login to continue.');
            try {
                let userTPerm: TablePermissions = (await db.tablePermissions.findOne({where: {tableId: data.id, userId: context.id}}))?.dataValues;

                const table: Table = (await db.tables.findByPk(data.id))?.dataValues;
                if(!table.name) throw new GraphQLError('The table does not exist.');

                let tableFields: TableField[] = table.fields;
                let tableName: string = `table_${table.id}`;
                const [tableData, tableMetaData] = await db.sequelize.query(`SELECT * FROM ${escapeIdPostgre(tableName)} ORDER BY id DESC;`);
                if(!tableData || (tableData.length <= 0)) throw new GraphQLError('No data found in the table.');

                let newTableData: RowsData  = tableData.map((row: any, rowIndex: number) => {
                    let newRow: RowData = [];
                    let fieldIndex: number = 0;
                    for (const [key, value] of Object.entries(row)) {
                        if(key !== 'id' && key !== 'createdat' && key !== 'updatedat'){
                            newRow.push({rowId: row.id, fieldId: tableFields[fieldIndex].id, title: tableFields[fieldIndex].title, value: value as string, createdat: row['createdat'], updatedat: row['updatedat']});
                            fieldIndex++;
                        }
                    }
                    return newRow;
                });
                return {id: table.id, rows: newTableData};
                
            } catch (error: any){
                throw new GraphQLError(error);
            }
        },

        getTableUsers: async (_root: any, data: {tableId: number}, context: Context):Promise<TableUser[]> =>{
            if(!context.auth) throw new GraphQLError('Unauthorized Access! Please login to continue.');
            try{
                let usrTablePrmResult = await db.tablePermissions.findOne({where: {tableId: data.tableId, userId: context.id}});
                if(!usrTablePrmResult) throw new GraphQLError("You do not have permission to view users of this table.");

                let usrTablePrm: TablePermissions = usrTablePrmResult.dataValues?.permissions;
                if(!context.permissions.tables.manageUserPermissions && !usrTablePrm.manageUsers) throw new GraphQLError("You do not have permission to view users of this table.");

                let tableUsrResult = await db.tablePermissions.findAll({where: {tableId: data.tableId}});
                if(tableUsrResult.length <= 0) throw new GraphQLError("No users found in this table.");

                let usrIds: number[] = [];
                let tableUsers: TableUser[] = tableUsrResult.map((usr: any) => {
                    usrIds.push(usr.dataValues.userId);
                    return {
                        id: usr.dataValues.userId,
                        username: null as any,
                        email: null as any,
                        permissions: usr.dataValues.permissions
                    }
                });

                let usrResult = await db.user.findAll({where: {id: usrIds}});
                usrResult.forEach((usr: any) => { // update username and email of the users
                    let index = tableUsers.findIndex((u: TableUser) => u.id === usr.dataValues.id);
                    tableUsers[index].username = usr.dataValues.username;
                    tableUsers[index].email = usr.dataValues.email;
                });

                return tableUsers;
            }
            catch (error: any){
                throw new GraphQLError(error);
            }
        }
    }
}