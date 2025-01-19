import { GraphQLError } from "graphql";

import { Context } from "../../context";

import { UserPermissions } from "..";
import { Read } from "./Read";
import { Update } from "./Update";
import { Delete } from "./Delete";

export const resolver = {
    Query: {
        getUsers: Read.Query.getUsers,
        getUser: Read.Query.getUser
    },
    Mutation: {
        updateUser: Update.Mutation.updateUser,
        deleteUser: Delete.Muation.deleteUser
    },
    User: {
        email: (_root: any, data: any, context: Context): string => {
            if (!context.auth) throw new GraphQLError('Unauthorized Access! Please login to continue.');
            if (!context.permissions.usersAcc.manage) throw new GraphQLError('You do not have permission to view user email.');
            return _root.email;
        },
        level: (_root: any, data: any, context: Context): number => {
            if (!context.auth) throw new GraphQLError('Unauthorized Access! Please login to continue.');
            if (!context.permissions.usersAcc.manage) throw new GraphQLError('You do not have permission to view user level.');
            return _root.level;
        },
        permissions: (_root: any, data: any, context: Context): UserPermissions => {
            if (!context.auth) throw new GraphQLError('Unauthorized Access! Please login to continue.');
            if (!context.permissions.usersAcc.manage) throw new GraphQLError('You do not have permission to view user permissions.');
            return _root.permissions;
        },
        createdAt: (_root: any, data: any, context: Context): string => {
            if (!context.auth) throw new GraphQLError('Unauthorized Access! Please login to continue.');
            return _root.createdAt;
        },
        updatedAt: (_root: any, data: any, context: Context): string => {
            if (!context.auth) throw new GraphQLError('Unauthorized Access! Please login to continue.');
            if (!context.permissions.usersAcc.manage) throw new GraphQLError('You do not have permission to view user account updates.');
            return _root.updatedAt;
        }
    }
}