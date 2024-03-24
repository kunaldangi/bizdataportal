import { GraphQLError } from "graphql";

import db from "../../../db";

export async function getUsers(_root: any, data: any, context: any){
    if (!context.auth) throw new GraphQLError('Unauthorized Access! Please login to continue.');
    try {
        const users = await db.user.findAll();
        return users.map((user: any) => user.dataValues);
    } catch (error: any) {
        return new GraphQLError(error);
    }
}

export const User = {
    email: (_root: any, _data: any, context: any) => {
        console.log(context)
        if (!context.auth) throw new GraphQLError('Unauthorized Access! Please login to continue.');
        if(!context.permissions.usersAcc.manage) throw new GraphQLError('You do not have permission to view email.')
        return _root.email;
    }
};