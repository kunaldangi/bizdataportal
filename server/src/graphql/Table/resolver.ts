import { Table, TableField } from ".";
import { Context } from "../context";

export const resolver = {
    Mutation: {
        createTable: async (_root: any, data: {name: string, fields: string}, context: Context): Promise<Table> => {
            const fields = JSON.parse(data.fields);
            return {id: 1, ownerId: context.id, name: data.name, description: "", fields: [fields]};
        }
    }
}