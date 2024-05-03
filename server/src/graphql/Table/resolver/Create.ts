import { GraphQLError } from "graphql";
import SqlString from "sqlstring";

import { escapeIdPostgre } from "../../../lib/sqlString";

import { Table, TableField } from "..";
import { Context } from "../../context";
import db from "../../../db";


export const Create = {
    Mutation: {
        createTable: async (_root: any, data: {name: string, fields: string}, context: Context): Promise<Table> => {
            if (!context.auth) throw new GraphQLError('Unauthorized Access! Please login to continue.');
            try {
                if(!context.permissions.tables.create) throw new GraphQLError('You do not have permission to create tables.');
                if(!data.name) throw new GraphQLError('Please provide a table name.');
    
                let fields: TableField[];
                if(!data.fields){ // If user does not provide fields
                    const result = await db.tables.create({name: data.name, ownerId: context.id, fields: data.fields});
                    if(result.dataValues.id){
                        const cqResult: any = await db.sequelize.query(`CREATE TABLE table_${result.dataValues.id} ( id SERIAL PRIMARY KEY )`);
                        
                        const tablePermResult = await db.tablePermissions.create({tableId: result.dataValues.id, userId: context.id, permissions: {writeEntry:true, manageRows:true, manageFields:true, manageTable:true, manageUsers:true}});
                        if(!tablePermResult.dataValues.id) throw new GraphQLError('Failed to create a table permissions.');
                        
                        if(cqResult[1]?.command) return result.dataValues;
                    }
                }
                else { // If user provides fields
                    fields = JSON.parse(data.fields);
                    let totalFields: number = 0;
                    fields = fields.map((field: TableField, index) => { // Validate fields
                        field.id = index;
                        totalFields++;
                        if(!field.title) throw new GraphQLError('Please provide a field title.');
                        if(!field.dataType || field.dataType !== 'text') field.dataType = 'number';
                        if(!field.defaultValue || isNaN(parseInt(field.defaultValue))){
                            if(field.dataType === 'text') field.defaultValue = '';
                            else if(field.dataType === 'number') field.defaultValue = '0';
                        }
                        return field;
                    });
    
                    const result = await db.tables.create({name: data.name, ownerId: context.id, fields: fields, totalFields: totalFields});
                    if(result.dataValues.id){
                        let createQuery: string = `CREATE TABLE table_${result.dataValues.id} ( id SERIAL PRIMARY KEY, `;
                        fields.forEach((field: TableField, index: number) => {
                            let dataType = '';
                            if(field.dataType === 'text') dataType = 'TEXT';
                            else if(field.dataType === 'number') dataType = 'NUMERIC';
                            if(index >= (fields.length - 1)) createQuery += `${field.title} ${dataType} DEFAULT ${field.defaultValue}`;
                            else createQuery += `${field.title} ${dataType} DEFAULT ${field.defaultValue}, `;
                        });
                        createQuery += `)`;
                        const cqResult: any = await db.sequelize.query(createQuery);
    
                        const tablePermResult = await db.tablePermissions.create({tableId: result.dataValues.id, userId: context.id, permissions: {writeEntry:true, manageRows:true, manageFields:true, manageTable:true, manageUsers:true}});
                        if(!tablePermResult.dataValues.id) throw new GraphQLError('Failed to create table permissions.');
                        if(cqResult[1]?.command) return result.dataValues;
                    }
                }
                throw new GraphQLError('Failed to create a table.');
            } catch (error: any) {
                throw new GraphQLError(error);
            }
        },
        writeInTable: async (_root: any, data: any, context: Context): Promise<any> => {
            if (!context.auth) throw new GraphQLError('Unauthorized Access! Please login to continue.');
            try {
                let userTPerm: any = await db.tablePermissions.findOne({where: {tableId: data.id, userId: context.id}});
                if(!userTPerm.dataValues.permissions.writeEntry && !context.permissions.tables.writeIn) throw new GraphQLError('You do not have permission to write a entry in this table.');
                
                let table: any = await db.tables.findByPk(data.id);
                if(table.dataValues.id != data.id) throw new GraphQLError('Table not found!');
                
                let tableFields: any = table.dataValues.fields;

                let userRows: any = JSON.parse(data.rows);
                for(let rowIndex=0; rowIndex<userRows.length; rowIndex++){
                    let row: any = userRows[rowIndex];
                    let tableName: string = `table_${parseInt(table.id)}`;
                    let insertQuery: string = `INSERT INTO ${escapeIdPostgre(tableName)} (`;
                    let fieldsQuery: string = '';
                    let valuesQuery: string = '';
                    row.forEach((field: any, fieldIndex: number) => {
                        if(!tableFields[field.id]) throw new GraphQLError('Invalid field id!');
                        fieldsQuery += `${escapeIdPostgre(tableFields[field.id].title)},`;
                        valuesQuery += `'${SqlString.escape(field.value)}',`;
                    });
                    fieldsQuery = fieldsQuery.slice(0, -1);
                    valuesQuery = valuesQuery.slice(0, -1);
                    insertQuery += `${fieldsQuery}) VALUES (${valuesQuery});`;
                    try {
                        const [result, metadata] = await db.sequelize.query(insertQuery);
                        if(!metadata) throw new GraphQLError('Failed to write in table.');
                    } catch (error: any) {
                        throw new GraphQLError(error);
                    }    
                }
                return {id: table.id, rows: userRows};
            } catch (error: any) {
                throw new GraphQLError(error);
            }
        }
    },
};