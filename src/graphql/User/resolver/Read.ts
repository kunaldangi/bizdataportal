import { GraphQLError } from "graphql";

import { Context } from "../../context";
import db from "../../../db";

import { User } from "..";

export const Read = {
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
    }
};