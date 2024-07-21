import { GraphQLError } from "graphql";

import { Context } from "../../context";
import db from "../../../db";

import { User } from "..";

export const Update = {
    Mutation: {
        updateUser: async function updateUser(_root: any, data: {id: number, email: string, userData: string}, context: Context): Promise<User> {
            if (!context.auth) throw new GraphQLError('Unauthorized Access! Please login to continue.');
            try {
                if(!data.id && !data.email) throw new GraphQLError('Please provide a user id or email.');
                if(!context.permissions.usersAcc.manage) throw new GraphQLError('You do not have permission to update user data.');
                
                const user: User = JSON.parse(data.userData);
                
                if(user.id || user.createdAt || user.updatedAt) throw new GraphQLError('You cannot update user id, created at or updated at fields.');
                if((user.level || user.permissions) && !context.permissions.usersAcc.managePermissions) throw new GraphQLError('You do not have permission to update user level or permissions.');
                if(user.level >= context.level) throw new GraphQLError('You cannot update a user\'s level to a higher or equal level compared to your own.');
                
                if(data.id){
                    const result = await db.user.findByPk(data.id);
                    if(result?.dataValues.level >= context.level) throw new GraphQLError('You cannot update the data of users with a higher or equal level to your own.');
                    result?.update(user);
                    return result?.dataValues;
                }
                else if(data.email){
                    const result = await db.user.findOne({ where: { email: data.email } });
                    if(result?.dataValues.level >= context.level) throw new GraphQLError('You cannot update the data of users with a higher or equal level than your own.');
                    result?.update(user);
                    return result?.dataValues;
                }
                return {} as User;
            } catch (error: any) {
                throw new GraphQLError(error);
            }
        }
    }
}