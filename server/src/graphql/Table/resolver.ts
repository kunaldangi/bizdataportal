import { GraphQLError } from "graphql";

import { Table, TableField } from ".";
import { Context } from "../context";
import db from "../../db";

export const resolver = {
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
                        if(cqResult[1]?.command) return result.dataValues;
                    }
                }
                throw new GraphQLError('Failed to create a table.');
            } catch (error: any) {
                throw new GraphQLError(error);
            }
        }
    }
}