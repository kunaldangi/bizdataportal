import { GraphQLError } from "graphql";

import { Context } from "../../context";
import db from "../../../db";
import { Response } from "../../Response";

import { User } from "..";

export const Delete = {
    Muation: {
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
                if(user.level >= context.level) throw new GraphQLError('You cannot delete a user with a higher or equal level to yours.');
                await userData?.destroy();
                return { status: 'success', message: 'Deleted!' };
            } catch (error: any) {
                throw new GraphQLError(error);
            }
        }
    }
}