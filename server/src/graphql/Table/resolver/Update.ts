import { GraphQLError } from "graphql";
import SqlString from "sqlstring";

import { escapeIdPostgre } from "../../../lib/sqlString";

import { RowData, RowsData, Table, TableField, TablePermissions} from "..";
import { Context } from "../../context";

import db from "../../../db";

export const Update = {
    Mutation: {
        editTable: async (_root: any, data: {id: number, table: string}, context: Context): Promise<Table> => { // Verfied
            if (!context.auth) throw new GraphQLError('Unauthorized Access! Please login to continue.');
            try {
                let tablePermissionResult: any = await db.tablePermissions.findOne({where: {tableId: data.id, userId: context.id}});
                let tablePermission: TablePermissions = tablePermissionResult.dataValues.permissions;
                if(!context.permissions.tables.manage && !tablePermission.manageTable) throw new GraphQLError('You do not have permission to manage tables.');

                const userTable: Table = JSON.parse(data.table); // Convert string to JSON Object
                const table: any = await db.tables.findByPk(data.id); // Find the table by id
                if(!table.dataValues.name) throw new GraphQLError('Table does not exist.');
                
                let tableFieldQuery: string = '';
                for (const [key, value] of Object.entries(userTable)) { // Updating tables dynamically

                    if(!table.dataValues[key]) throw new GraphQLError(`'${key}' do not exists in the table.`);
                    if(key === 'id' || key === 'createdAt' || key === 'updatedAt') throw new GraphQLError(`You cannot change 'id', 'createdAt', 'updatedAt' of a table.`);

                    if(key === 'ownerId'){ // Only Admins or Owner of table can change ownerId
                        if(!context.permissions.tables.manage && !(table.dataValues.ownerId == context.id)) throw new GraphQLError('You do not have permission to change ownerId of the table.');
                        try {
                            const user: any = await db.user.findByPk(value);
                            if(!user.dataValues) throw new GraphQLError(`User with id '${value}' does not exist.`);
                            table.dataValues[key] = parseInt(value);
                        } catch (error) {
                            throw new GraphQLError(`User with id '${value}' does not exist. ERROR: ${error}`);
                        }
                    }

                    let tableName: string = `table_${parseInt(table.dataValues.id)}`;

                    if(key === 'fields'){ // To handle 'fields' differently
                        if(!context.permissions.tables.manage && !tablePermission.manageFields) throw new GraphQLError('You do not have permission to manage fields of the table.');
                        for(let i=0; i<value.length; i++){ // Loop through the fields array
                            for(const [fKey, fValue] of Object.entries(value[i])){
                                if(fKey === 'id') throw new GraphQLError(`You cannot change 'id' of a field.`);
                                if(!table.dataValues[key][i].hasOwnProperty(fKey)) throw new GraphQLError(`'${fKey}' do not exist in the fields.`);
                                if(fKey === 'dataType' && !(fValue === 'text' || fValue === 'number')) throw new GraphQLError(`Invalid data type '${fValue}'! dataType can only be 'text' or 'number'.`);
                                
                                if(fKey === 'title'){ // You have to make sure title/column name change first before changing column types
                                    tableFieldQuery += `ALTER TABLE ${escapeIdPostgre(tableName)} RENAME COLUMN ${escapeIdPostgre(table.dataValues[key][i]['title'])} TO ${escapeIdPostgre(fValue)}; `;
                                }
                                if(fKey === 'defaultValue' && table.dataValues[key][i]['dataType'] === "text"){
                                    try {
                                        let value: any = fValue; // because we cannot change type of fValue
                                        let dfValue: string = value.toString();
                                        tableFieldQuery += `ALTER TABLE ${escapeIdPostgre(tableName)} ALTER COLUMN ${escapeIdPostgre(userTable.fields[i].title)} SET DEFAULT ${SqlString.escape(dfValue)}; `;	
                                        table.dataValues[key][i][fKey] = dfValue;
                                    } catch (error) {
                                        throw new GraphQLError(`Invalid default value type for field '${table.dataValues[key][i]['title']}'! Make sure default value must be a string. ERROR: ${error}`);
                                    }
                                }
                                else if(fKey === 'defaultValue' && table.dataValues[key][i]['dataType'] === "number"){
                                    try {
                                        let value: any = fValue; // because we cannot change type of fValue
                                        let dfValue: number = parseInt(value);
                                        if(isNaN(dfValue)) throw new GraphQLError(`Invalid default value type for field '${table.dataValues[key][i]['title']}'! Make sure default value must be a number.`);
                                        tableFieldQuery += `ALTER TABLE ${escapeIdPostgre(tableName)} ALTER COLUMN ${escapeIdPostgre(userTable.fields[i].title)} SET DEFAULT ${SqlString.escape(dfValue)}; `;
                                        table.dataValues[key][i][fKey] = dfValue;
                                    } catch (error) {
                                        throw new GraphQLError(`Invalid default value type for field '${table.dataValues[key][i]['title']}'! Make sure default value must be a number. ${error}`);
                                    }
                                }

                                else{
                                    if(fKey === 'dataType'){
                                        let dataType: string = '';
                                        if(fValue === 'text') dataType = 'TEXT';
                                        else if(fValue === 'number') dataType = 'NUMERIC';
                                        tableFieldQuery += `ALTER TABLE ${escapeIdPostgre(tableName)} ALTER COLUMN ${escapeIdPostgre(userTable.fields[i].title)} SET DATA TYPE ${dataType}; `;
                                    }
                                    table.dataValues[key][i][fKey] = fValue; // Update the field value
                                }
                            }
                        }
                    }
                    else{
                        table.dataValues[key] = value; // Update the table value in else or it will override somes values
                    }
                }
                const tableResult  = await db.tables.update({ownerId: table.dataValues.ownerId, name: table.dataValues.name, description: table.dataValues.description, fields: table.dataValues.fields}, {where: {id: table.dataValues.id}});
                const [fieldResult, fieldMetaData]: any = await db.sequelize.query(tableFieldQuery);
                if(!tableResult[0]) throw new GraphQLError('Failed to update \'tables\'.');
                if(!fieldMetaData[0].command) throw new GraphQLError(`Failed to update fields of \'table_${table.dataValues.id}\'.`);
                return table.dataValues;

            } catch (error: any) {
                throw new GraphQLError(error);
            }
        },
        editRows: async (_root: any, data: {id: number, rows: string}, context: Context): Promise<{id: number, rows: RowsData}> => {
            if (!context.auth) throw new GraphQLError('Unauthorized Access! Please login to continue.');
            try{
                let userTPerm: TablePermissions = (await db.tablePermissions.findOne({where: {tableId: data.id, userId: context.id}}))?.dataValues?.permissions;
                if(!userTPerm.manageRows && !context.permissions.tables.manage) throw new GraphQLError('You do not have permission to edit rows in this table.');
                
                let table: Table = (await db.tables.findByPk(data.id))?.dataValues;
                if(table.id != data.id) throw new GraphQLError('Table not found!');
                let tableFields: TableField[] = table.fields;

                let rowsData: RowsData = JSON.parse(data.rows);
                let tableName: string = `table_${table.id}`; let query: string = ``;
                let rowIds: number[] = [];
                rowsData.forEach((fieldData, rowIndex) => {
                    let rowId: number = -1;
                    let updateQuery: string = `UPDATE ${escapeIdPostgre(tableName)} SET`;
                    fieldData.forEach((field, fieldIndex) => {
                        if(!tableFields[field.fieldId]) throw new GraphQLError(`Field not found with id ${field.fieldId}.`);
                        rowId = field.rowId;
                        updateQuery += ` ${escapeIdPostgre(tableFields[field.fieldId].title)} = ${SqlString.escape(field.value)},`;
                    });
                    updateQuery += ` "updatedat" = ${SqlString.escape(new Date().toISOString())}`
                    updateQuery += ` WHERE "id" = ${SqlString.escape(fieldData[0].rowId)};`
                    query += updateQuery;
                    rowIds.push(rowId);
                });
                const [editQueryResult, editQueryMetaData]: any = await db.sequelize.query(query);
                if(!editQueryMetaData[0].command) throw new GraphQLError('Failed to update rows.');

                let rowIdsString: string = rowIds.join(',');
                const [rowsResult, rowsMetaData]: any = await db.sequelize.query(`SELECT * FROM ${escapeIdPostgre(tableName)} WHERE "id" IN (${rowIdsString});`);
                if(!rowsMetaData || (rowsResult.length <= 0)) throw new GraphQLError('Failed to fetch updated rows.');
                
                let tableRows: RowsData = rowsResult.map((row: any, rowIndex: number) => {
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
            }
            catch(error: any){
                throw new GraphQLError(error);
            }
        }
    }
};