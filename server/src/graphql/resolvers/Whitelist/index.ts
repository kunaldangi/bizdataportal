import { GraphQLError } from "graphql";
import validator from "validator";

import db from "../../../db";

export async function getWhitelistEmails(_root: any, _args: any, context: any){
    if (!context.auth) throw new GraphQLError('Unauthorized Access! Please login to continue.');
    try {
        if(!context.permissions.usersAcc.manageWhitelist) throw new GraphQLError('You do not have permission to manage whitelist.');
        const result = await db.whitelistEmail?.findAll();
        return result.map((item: any) => {
            return { 
                id: item?.dataValues.id,
                email: item?.dataValues.email,
                createdAt: `${item?.dataValues.createdAt}`,
                updatedAt: `${item?.dataValues.updatedAt}`
            };
        });
    } catch (error: any) {
        return new GraphQLError(error);
    }
}

export async function addWhitelistEmail(_root: any, {email}: {email: String}, context: any){
    if (!context.auth) throw new GraphQLError('Unauthorized Access! Please login to continue.');
    try {
        if(!context.permissions.usersAcc.manageWhitelist) throw new GraphQLError('You do not have permission to manage whitelist.');
        if(!validator.isEmail(email as any)) throw new GraphQLError('Invalid email address. Please provide a valid email address.');
        const result = await db.whitelistEmail?.create({email: email});
        return { 
            id: result?.dataValues.id,
            email: result?.dataValues.email,
            createdAt: `${result?.dataValues.createdAt}`,
            updatedAt: `${result?.dataValues.updatedAt}`
        };
    } catch (error: any) {
        return new GraphQLError(error?.errors[0]?.message);
    }
}

export async function deleteWhitelistEmail(_root: any, data: any, context: any){
    if (!context.auth) throw new GraphQLError('Unauthorized Access! Please login to continue.');
    try {
        if(!context.permissions.usersAcc.manageWhitelist) throw new GraphQLError('You do not have permission to manage whitelist.');
        
        let result: any;
        if(data.id) result = await db.whitelistEmail?.destroy({where: {id: data.id}});
        else if(data.email) result = await db.whitelistEmail?.destroy({where: {email: data.email}});
        
        return { status: result === 1 ? 'ok' : 'error', message: result === 1 ? 'Email deleted successfully.' : 'Error while deleting email.'};
    } catch (error: any) {
        return new GraphQLError(error);
    }
}