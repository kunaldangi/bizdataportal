import { GraphQLError } from "graphql";

import { escapeIdPostgre } from "../../../lib/sqlString";

import { Table, TableField, TablePermissions } from "..";
import { Context } from "../../context";

import db from "../../../db";

export const Read = {
    Query: {
        getTable: async (_root: any, data: {id: number}, context: Context): Promise<Table> => { // Verified
            if (!context.auth) throw new GraphQLError('Unauthorized Access! Please login to continue.');
            try {
                let result: any = await db.tablePermissions.findOne({where: {userId: context.id, tableId: data.id}});
                if(!result?.dataValues) throw new GraphQLError('You do not have permission to view this table.');

                let tablePerm: TablePermissions = result.dataValues.permissions;
                if(!tablePerm && !context.permissions.tables.read) throw new GraphQLError('You do not have permission to view this table.');
    
                const table = await db.tables.findByPk(data.id);
                if(table?.dataValues) return table?.dataValues;
                
                throw new GraphQLError('No tables found.');
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
        readTable: async (_root: any, data: {id: number}, context: Context):Promise<any> => {
            if (!context.auth) throw new GraphQLError('Unauthorized Access! Please login to continue.');
            try {
                let userTPerm: any = await db.tablePermissions.findOne({where: {tableId: data.id, userId: context.id}});
                if (!context.permissions.tables.read && !userTPerm.dataValues.permissions) throw new GraphQLError('You do not have permission to read this table.');
                
                const table: any = await db.tables.findByPk(data.id);
                if(!table.dataValues.name) throw new GraphQLError('Table not found!');

                let tableFields: TableField[] = table.dataValues.fields;
                let tableName: string = `table_${parseInt(table.id)}`;
                const [tableData, tableMetaData] = await db.sequelize.query(`SELECT * FROM ${escapeIdPostgre(tableName)} ORDER BY id DESC;`);
                if(!tableData || (tableData.length <= 0)) throw new GraphQLError('No data found in the table.');

                let newTableData = tableData.map((row: any, rowIndex: number) => {
                    let newRow: any[] = [];
                    let fieldIndex: number = 0;
                    for (const [key, value] of Object.entries(row)) {
                        if(key !== 'id' && key !== 'createdat' && key !== 'updatedat'){
                            newRow.push({rowId: row.id, fieldId: tableFields[fieldIndex].id, title: tableFields[fieldIndex].title, value: value, createdat: row['createdat'], updatedat: row['updatedat']});
                            fieldIndex++;
                        }
                    }
                    return newRow;
                });
                return {id: table.id, rows: newTableData};
            } catch (error: any){
                throw new GraphQLError(error);
            }
        }
    }
}