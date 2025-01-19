import { GraphQLError } from "graphql";
import SqlString from "sqlstring";

import { escapeIdPostgre } from "../../../lib/sqlString";

import { RowsData, RowData, Table, TableField, TablePermissions, TableUser } from "..";
import { Context } from "../../context";

import db from "../../../db";
import { User } from "../../User";
import { UniqueConstraintError } from "sequelize";


export const Create = {
    Mutation: {
        createTable: async (_root: any, data: {name: string, fields: string}, context: Context): Promise<Table> => { // Verified
            if (!context.auth) throw new GraphQLError('Unauthorized Access! Please login to continue.');
            try {
                if(!context.permissions.tables.create) throw new GraphQLError('You do not have permission to create tables.');
                if(!data.name) throw new GraphQLError('Please provide a table name.');
    
                if(!data.fields){ // If user does not provide fields
                    const tableResult = await db.tables.create({name: data.name, ownerId: context.id, fields: [], totalFields: 0});
                    let tableInfo: Table = tableResult.dataValues;

                    if(tableResult?.dataValues?.id){
                        const cqResult: any = await db.sequelize.query(`CREATE TABLE table_${tableInfo.id} ( id SERIAL PRIMARY KEY );`);
                        const tablePermResult = await db.tablePermissions.create({tableId: tableInfo.id, userId: context.id, permissions: {writeEntry:true, manageRows:true, manageFields:true, manageTable:true, manageUsers:true}});
                        
                        if(!tablePermResult.dataValues.id) throw new GraphQLError('Failed to create table permissions.');
                        if(cqResult[1]?.command) return tableInfo;
                    }
                }
                else { // If user provides fields
                    let fields: TableField[] = JSON.parse(data.fields);
                    let totalFields: number = 0;

                    fields = fields.map((field: TableField, index) => { // Validate fields
                        field.id = index;
                        
                        if(!field.title) throw new GraphQLError('Please provide a field title.');
                        if(!field.dataType || field.dataType !== 'text') field.dataType = 'number';
                        if(!field.defaultValue || isNaN(parseInt(field.defaultValue))){
                            if(field.dataType === 'text') field.defaultValue = '';
                            else if(field.dataType === 'number') field.defaultValue = '0';
                        }

                        totalFields++;
                        return field;
                    });
    
                    const result = await db.tables.create({name: data.name, ownerId: context.id, fields: fields, totalFields: totalFields});
                    let table: Table = result.dataValues;

                    if(table.id){
                        let createQuery: string = `CREATE TABLE table_${table.id} ( id SERIAL PRIMARY KEY, `;

                        fields.forEach((field: TableField, index: number) => {
                            let dataType: string = '';
                            if(field.dataType === 'text') dataType = 'TEXT';
                            else if(field.dataType === 'number') dataType = 'NUMERIC';
                            if(index >= (fields.length - 1)) createQuery += `${escapeIdPostgre(field.title)} ${dataType} DEFAULT ${SqlString.escape(field.defaultValue)}`;
                            else createQuery += `${escapeIdPostgre(field.title)} ${dataType} DEFAULT ${SqlString.escape(field.defaultValue)}, `;
                        });

                        createQuery += `, createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, updatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP);`;
                        const cqResult: any = await db.sequelize.query(createQuery);
                        
                        const tablePermResult = await db.tablePermissions.create({tableId: table.id, userId: context.id, permissions: {writeEntry:true, manageRows:true, manageFields:true, manageTable:true, manageUsers:true}});
                        if(!tablePermResult.dataValues.id) throw new GraphQLError('Failed to create table permissions.');
                        
                        if(cqResult[1]?.command) return table;
                    }
                }
                throw new GraphQLError('Failed to create a table.');
            } catch (error: any) {
                throw new GraphQLError(error);
            }
        },
        writeInTable: async (_root: any, data: {id: number, rows: string}, context: Context): Promise<{id: number, rows: RowsData}> => { // Verified
            if (!context.auth) throw new GraphQLError('Unauthorized Access! Please login to continue.');
            try {
                let userTPerm: TablePermissions = (await db.tablePermissions.findOne({where: {tableId: data.id, userId: context.id}}))?.dataValues;
                if(!userTPerm.writeEntry && !context.permissions.tables.writeIn) throw new GraphQLError('You do not have permission to write an entry in this table.');
                
                let table: Table = (await db.tables.findByPk(data.id))?.dataValues;
                if(table.id != data.id) throw new GraphQLError('No table found!');
                let tableFields: TableField[] = table.fields;

                let userRows: RowsData = JSON.parse(data.rows);
                for(let rowIndex=0; rowIndex<userRows.length; rowIndex++){
                    let row: RowData = userRows[rowIndex];

                    let tableName: string = `table_${table.id}`;
                    let insertQuery: string = `INSERT INTO ${escapeIdPostgre(tableName)} (`;
                    let fieldsQuery: string = '', valuesQuery: string = '';

                    row.forEach((fields: any, fieldIndex: number) => {
                        if(!tableFields[fields.fieldId]) throw new GraphQLError('Invalid field id!');
                        fieldsQuery += `${escapeIdPostgre(tableFields[fields.fieldId].title)},`;
                        valuesQuery += `'${SqlString.escape(fields.value)}',`;
                    });

                    fieldsQuery = fieldsQuery.slice(0, -1);
                    valuesQuery = valuesQuery.slice(0, -1);
                    insertQuery += `${fieldsQuery}) VALUES (${valuesQuery});`;
                    try {
                        const [result, metadata] = await db.sequelize.query(insertQuery);
                        if(!metadata) throw new GraphQLError('Failed to write an entry to the table.');

                    } catch (error: any) {
                        throw new GraphQLError(error);
                    }    
                }

                let tableName: string = `table_${table.id}`;
                const [tableData, tableMetaData] = await db.sequelize.query(`SELECT * FROM ${escapeIdPostgre(tableName)} ORDER BY id DESC LIMIT ${SqlString.escape((userRows.length+1))};`);
                if(!tableData || (tableData.length <= 0)) throw new GraphQLError('No entry found in the table.');

                let tableRows: RowsData = tableData.map((row: any, rowIndex: number) => {
                    let newRow: RowData = [];
                    let fieldIndex: number = 0;
                    for (const [key, value] of Object.entries(row)) {
                        if(key !== 'id' && key !== 'createdat' && key !== 'updatedat'){
                            console.log(row['createdat'], row['updatedat']);
                            newRow.push({rowId: row.id, fieldId: tableFields[fieldIndex].id, title: tableFields[fieldIndex].title, value: value as string, createdat: row['createdat'], updatedat: row['updatedat']});
                            fieldIndex++;
                        }
                    }
                    return newRow;
                });
                return {id: table.id, rows: tableRows};
            } catch (error: any) {
                throw new GraphQLError(error);
            }
        },
        addTableUser: async (_root: any, data: {tableId: number, userId: number, permissions: string}, context: Context): Promise<TableUser> => {
            if(!context.auth) throw new GraphQLError('Unauthorized Access! Please login to continue.');
            try{
                let usrTablePrmResult: any = await db.tablePermissions.findOne({where: {tableId: data.tableId, userId: context.id}});
                let usrTablePrm: TablePermissions = usrTablePrmResult?.dataValues?.permissions;

                if(!context.permissions.tables.manageUserPermissions && !usrTablePrm?.manageUsers) throw new GraphQLError("You do not have permission to add users in this table."); // u need admin permission or table mange user permission

                let usrResult = await db.user.findByPk(data.userId);
                let user: User = usrResult?.dataValues;
                if(!usrResult || !user.id) throw new GraphQLError('User not found.');

                let addUsrTablePrmResult = await db.tablePermissions.create({tableId: data.tableId, userId: data.userId});
                if(!addUsrTablePrmResult.dataValues.id) throw new GraphQLError('Failed to add a user in the table.');

                return {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    permissions: addUsrTablePrmResult.dataValues.permissions
                };
            }
            catch(error: any){
                if(error instanceof UniqueConstraintError) throw new GraphQLError('The user is already present in the table.');
                throw new GraphQLError(error);
            }
        }
    },
};