import { GraphQLError } from "graphql";

import { Table, TableField } from "..";
import { Context } from "../../context";
import db from "../../../db";


import { Update } from "./Update";
import { Create } from "./Create";
import { Read } from "./Read";


export const resolver = {
    Query: {
        getTable: Read.Query.getTable,
        getTables: Read.Query.getTables,
        viewTable: Read.Query.viewTable
    },
    Mutation: {
        createTable: Create.Mutation.createTable,
        editTable: Update.Mutation.editTable
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