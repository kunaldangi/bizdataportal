import { GraphQLError } from "graphql";

import { Table, TableField } from ".";
import { Context } from "../context";
import db from "../../db";

export const resolver = {
    Query: {
        getTable: async (_root: any, data: {id: number}, context: Context): Promise<Table> => {
            if (!context.auth) throw new GraphQLError('Unauthorized Access! Please login to continue.');
            try {
                let tablePerm: any = await db.tablePermissions.findOne({where: {userId: context.id, tableId: data.id}});
                if(!tablePerm.dataValues.permissions || context.permissions.tables.read) throw new GraphQLError('You do not have permission to view this table.');

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
                    const result = await db.tables.findAll(); // get all tables
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
                throw new GraphQLError('No tables found.');
            } catch (error: any) {
                throw new GraphQLError(error);
            }
        }
    },
    Mutation: {
        createTable: async (_root: any, data: {name: string, fields: string}, context: Context): Promise<Table> => {
            if (!context.auth) throw new GraphQLError('Unauthorized Access! Please login to continue.');
            try {
                if(!context.permissions.tables.create) throw new GraphQLError('You do not have permission to create tables.');
                if(!data.name) throw new GraphQLError('Please provide a table name.');

                let fields: TableField[];
                if(!data.fields){ 
                    const result = await db.tables.create({name: data.name, ownerId: context.id, fields: data.fields});
                    if(result.dataValues.id){
                        const cqResult: any = await db.sequelize.query(`CREATE TABLE table_${result.dataValues.id} ( id SERIAL PRIMARY KEY )`);
                        
                        const tablePermResult = await db.tablePermissions.create({tableId: result.dataValues.id, userId: context.id, permissions: '{"writeEntry":true,"manageRows":true,"manageFields":true,"manageTable":true,"manageUsers":true}'});
                        if(!tablePermResult.dataValues.id) throw new GraphQLError('Failed to create table permissions.');
                        
                        if(cqResult[1]?.command) return result.dataValues;
                    }
                }
                else {
                    fields = JSON.parse(data.fields);
                    fields = fields.map((field: TableField) => {
                        if(!field.title) throw new GraphQLError('Please provide a field title.');
                        if(!field.dataType) field.dataType = 'number';
                        if(!field.defaultValue){
                            if(field.dataType === 'text') field.defaultValue = '';
                            else if(field.dataType === 'number') field.defaultValue = '0';
                        }
                        return field;
                    });

                    const result = await db.tables.create({name: data.name, ownerId: context.id, fields: fields});
                    if(result.dataValues.id){
                        let createQuery: string = `CREATE TABLE table_${result.dataValues.id} ( id SERIAL PRIMARY KEY, `;
                        fields.forEach((field: TableField, index) => {
                            let dataType = '';
                            if(field.dataType === 'text') dataType = 'TEXT';
                            else if(field.dataType === 'number') dataType = 'NUMERIC';
                            if(index >= (fields.length - 1)) createQuery += `${field.title} ${dataType} DEFAULT ${field.defaultValue}`;
                            else createQuery += `${field.title} ${dataType} DEFAULT ${field.defaultValue}, `;
                        });
                        createQuery += `)`;
                        const cqResult: any = await db.sequelize.query(createQuery);

                        const tablePermResult = await db.tablePermissions.create({tableId: result.dataValues.id, userId: context.id, permissions: '{"writeEntry":true,"manageRows":true,"manageFields":true,"manageTable":true,"manageUsers":true}'});
                        if(!tablePermResult.dataValues.id) throw new GraphQLError('Failed to create table permissions.');
                        if(cqResult[1]?.command) return result.dataValues;
                    }
                }
                throw new GraphQLError('Failed to create a table.');
            } catch (error: any) {
                throw new GraphQLError(error);
            }
        }
    },
    Table: {
        id: (_root: any, data: any, context: Context): number => {
            if (!context.auth) throw new GraphQLError('Unauthorized Access! Please login to continue.');
            // console.log(_root);
            return _root.id;
        }
        // ownerId: ID
        // name: String
        // description: String
        // fields: [TableFields]
    }
}