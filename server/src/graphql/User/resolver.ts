import { GraphQLError } from "graphql";

import { Context } from "../context";
import db from "../../db";
import { Response } from "../Response";

export const resolver = {
    Query: {
        getUsers: async function getUsers(_root: any, data: any, context: Context): Promise<User[]> {
            if (!context.auth) throw new GraphQLError('Unauthorized Access! Please login to continue.');
            try {
                const users = await db.user.findAll();
                return users.map((user: any) => user.dataValues);
            } catch (error: any) {
                throw new GraphQLError(error);
            }
        },
        getUser: async function getUser(_root: any, data: {id: number, email: string}, context: Context): Promise<User> {
            if (!context.auth) throw new GraphQLError('Unauthorized Access! Please login to continue.');
            try {
                if(!data.id && !data.email) throw new GraphQLError('Please provide a user id or email.');
                if(data.id){
                    const result = await db.user.findByPk(data.id);
                    if(result) return result?.dataValues;
                }
                else if(data.email){
                    const result = await db.user.findOne({ where: { email: data.email } });
                    if(result) return result?.dataValues;
                }
                throw new GraphQLError('User not found.');
            } catch (error: any) {
                throw new GraphQLError(error);
            }
        }
    },

    Mutation: {
        updateUser: async function updateUser(_root: any, data: {id: number, email: string, userData: string}, context: Context): Promise<User> {
            if (!context.auth) throw new GraphQLError('Unauthorized Access! Please login to continue.');
            try {
                if(!data.id && !data.email) throw new GraphQLError('Please provide a user id or email.');
                if(!context.permissions.usersAcc.manage) throw new GraphQLError('You do not have permission to update user data.');
                
                const user: User = JSON.parse(data.userData);
                
                if(user.id || user.createdAt || user.updatedAt) throw new GraphQLError('You cannot update user id, created at or updated at fields.');
                if((user.level || user.permissions) && !context.permissions.usersAcc.managePermissions) throw new GraphQLError('You do not have permission to update user level or permissions.');
                if(user.level >= context.level) throw new GraphQLError('You cannot update user level to a higher or equal level to your own level.');
                
                if(data.id){
                    const result = await db.user.findByPk(data.id);
                    if(result?.dataValues.level >= context.level) throw new GraphQLError('You cannot update user data of a higher or equal level user.');
                    result?.update(user);
                    return result?.dataValues;
                }
                else if(data.email){
                    const result = await db.user.findOne({ where: { email: data.email } });
                    if(result?.dataValues.level >= context.level) throw new GraphQLError('You cannot update user data of a higher or equal level user.');
                    result?.update(user);
                    return result?.dataValues;
                }
                return {} as User;
            } catch (error: any) {
                throw new GraphQLError(error);
            }
        },
        deleteUser: async function deleteUser(_root: any, data: {id: number, email: string, userData: string}, context: Context): Promise<Response> {
            if (!context.auth) throw new GraphQLError('Unauthorized Access! Please login to continue.');
            try {
                if(!data.id && !data.email) throw new GraphQLError('Please provide a user id or email.');
                if(!context.permissions.usersAcc.manage) throw new GraphQLError('You do not have permission to delete user account.');
                
                let userData;
                if(data.id) userData = await db.user.findByPk(data.id);
                else if(data.email) userData = await db.user.findOne({ where: { email: data.email } });
                
                if(!userData) throw new GraphQLError('User not found.');
                let user: User = userData?.dataValues;
                if(user.level >= context.level) throw new GraphQLError('You cannot delete a user of a higher or equal level to your level.');
                await userData?.destroy();
                return { status: 'success', message: 'User deleted successfully.' };
            } catch (error: any) {
                throw new GraphQLError(error);
            }
        }
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
            return JSON.parse(_root.permissions);
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

export interface User {
    id: number;
    username: string;
    email: string;
    level: number;
    permissions: UserPermissions;
    createdAt: string;
    updatedAt: string;
}

interface UserPermissions{
    usersAcc: UserAccountPermissions
    tables: UserTablePermissions
}

interface UserAccountPermissions{
    manage: boolean;
    managePermissions: boolean;
    manageWhitelist: boolean;  
}

interface UserTablePermissions{
    create: boolean;
    read: boolean;
    writeIn: boolean;
    manage: boolean;
    manageUserPermissions: boolean;
}

