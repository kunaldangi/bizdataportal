import { GraphQLError } from "graphql";

import { Table, TableField } from "..";
import { Context } from "../../context";
import db from "../../../db";

export const Update = {
    Mutation: {
        editTable: async (_root: any, data: {id: number, table: string}, context: Context): Promise<Table> => {
            if (!context.auth) throw new GraphQLError('Unauthorized Access! Please login to continue.');
            try {
                let userTPerm: any = await db.tablePermissions.findOne({where: {tableId: data.id, userId: context.id}});
                if(context.permissions.tables.manage || userTPerm.dataValues.permissions.manageTable){

                    const userTable: Table = JSON.parse(data.table); // Convert string to JSON Object
                    const table: any = await db.tables.findByPk(data.id); // Find the table by id
                    if(!table.dataValues.name) throw new GraphQLError('Table does not exist.');
                    
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

                        if(key === 'fields'){ // To handle 'fields' differently
                            if(!context.permissions.tables.manage && !userTPerm.dataValues.permissions.manageFields) throw new GraphQLError('You do not have permission to manage fields of the table.');
                            for(let i=0; i<value.length; i++){ // Loop through the fields array
                                for(const [fKey, fValue] of Object.entries(value[i])){
                                    if(fKey === 'id') throw new GraphQLError(`You cannot change 'id' of a field.`);
                                    if(!table.dataValues[key][i][fKey]) throw new GraphQLError(`'${fKey}' do not exist in the fields.`);
                                    if(fKey === 'dataType' && !(fValue === 'text' || fValue === 'number')) throw new GraphQLError(`Invalid data type '${fValue}'! dataType can only be 'text' or 'number'.`);
                                    if(fKey === 'defaultValue' && table.dataValues[key][i]['dataType'] === "text"){
                                        try {
                                            let value: any = fValue; // because we cannot change type of fValue
                                            let dfValue: string = value.toString();
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
                                            table.dataValues[key][i][fKey] = dfValue;
                                        } catch (error) {
                                            throw new GraphQLError(`Invalid default value type for field '${table.dataValues[key][i]['title']}'! Make sure default value must be a number. ${error}`);
                                        }
                                    }
                                    else{
                                        table.dataValues[key][i][fKey] = fValue;
                                    }
                                }
                            }
                        }

                        table.dataValues[key] = value;
                    }
                    const result = await db.tables.update({ownerId: table.dataValues.ownerId, name: table.dataValues.name, description: table.dataValues.description, fields: table.dataValues.fields}, {where: {id: table.dataValues.id}});
                    console.log(result);
                    return table.dataValues;
                }
                else{
                    throw new GraphQLError('You do not have permission to manage tables.');
                }

            } catch (error: any) {
                throw new GraphQLError(error);
            }
        }
    }
};