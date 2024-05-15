import { GraphQLError } from "graphql";

import { Context } from "../../context";

import { Update } from "./Update";
import { Create } from "./Create";
import { Read } from "./Read";


export const resolver = {
    Query: {
        getTable: Read.Query.getTable,
        getTables: Read.Query.getTables,
        readTable: Read.Query.readTable,
        getTableUsers: Read.Query.getTableUsers
    },
    Mutation: {
        createTable: Create.Mutation.createTable,
        editTable: Update.Mutation.editTable,
        writeInTable: Create.Mutation.writeInTable,
        editRows: Update.Mutation.editRows,
        addTableUser: Create.Mutation.addTableUser
    },

    Table: {
        id: (_root: any, data: {id: number, rows: string}, context: Context): number => {
            if (!context.auth) throw new GraphQLError('Unauthorized Access! Please login to continue.');
            // console.log(_root);
            return _root.id;
        },
        // ownerId: ID
        // name: String
        // description: String
        // fields: [TableFields]
        // totalFields: Int
    }
}