import { GraphQLError } from "graphql";

import { Table, TableField } from "..";
import { Context } from "../../context";
import db from "../../../db";

export const Read = {
    Query: {
        getTable: async (_root: any, data: {id: number}, context: Context): Promise<Table> => {
            if (!context.auth) throw new GraphQLError('Unauthorized Access! Please login to continue.');
            try {
                let tablePerm: any = await db.tablePermissions.findOne({where: {userId: context.id, tableId: data.id}});
                console.log(tablePerm.dataValues.permissions)
                if(!(tablePerm.dataValues.permissions || context.permissions.tables.read)) throw new GraphQLError('You do not have permission to view this table.');
    
                const table = await db.tables.findByPk(data.id);
                if(table?.dataValues) return table?.dataValues;
                throw new GraphQLError('No tables found.');
            } catch (error: any) {
                throw new GraphQLError(error);
            }
        },
        getTables: async (_root: any, _:any, context: Context):Promise<Table[]> => {
            if (!context.auth) throw new GraphQLError('Unauthorized Access! Please login to continue.');
            try {
                if (context.permissions.tables.read){
                    const result = await db.tables.findAll(); // get all tables if user have permission to read all tables
                    if(result.length > 0) return result.map((table: any) => table.dataValues);
                }
                else {
                    const result: any = await db.tablePermissions.findAll({where: {userId: context.id}}); // get all tables that the user has access to read/view.
                    
                    let tables: Table[] = [];
                    for(let i = 0; i < result.length; i++){ // loop all the tables
                        const table = await db.tables.findByPk(result[i].dataValues.tableId);
                        tables.push(table?.dataValues);
                    }
    
                    if(tables.length > 0) return tables;
                }
                throw new GraphQLError('No tables found!');
            } catch (error: any) {
                throw new GraphQLError(error);
            }
        },
        viewTable: async (_root: any, data: {id: number}, context: Context):Promise<string> => {
            if (!context.auth) throw new GraphQLError('Unauthorized Access! Please login to continue.');
            try {
                if (context.permissions.tables.read){
                    const table: any = await db.tables.findByPk(data.id);
                    if(!table.dataValues.name) throw new GraphQLError('Table not found!');
                    // const [tableData, tableMetaData] = await db.sequelize.query('SELECT * FROM table');
                    console.log(table.dataValues);
                }
                return "";
            } catch (error: any){
                throw new GraphQLError(error);
            }
        }
    }
}