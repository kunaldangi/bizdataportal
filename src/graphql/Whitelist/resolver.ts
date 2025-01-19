import { GraphQLError } from "graphql";
import validator from "validator";

import { Response } from "../Response";

import db from "../../db";
import { Context } from "../context";
import { Whitelist } from ".";


export const resolver = {
    Query: {
        getWhitelistEmails: async function getWhitelistEmails(_root: any, _args: any, context: Context): Promise<Whitelist[]>{
            if (!context.auth) throw new GraphQLError('Unauthorized Access! Please login to continue.');
            try {
                if(!context.permissions.usersAcc.manageWhitelist) throw new GraphQLError('You do not have permission to manage the whitelist.');
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
                throw new GraphQLError(error);
            }
        }
    },
    Mutation: {
        addWhitelistEmail: async function addWhitelistEmail(_root: any, {email}: {email: String}, context: Context): Promise<Whitelist>{       
            if (!context.auth && !(process.env.SERVER_RUN_MODE === "development")) throw new GraphQLError('Unauthorized Access! Please login to continue.');
            try {
                if(!context?.permissions?.usersAcc?.manageWhitelist && !(process.env.SERVER_RUN_MODE === "development")) throw new GraphQLError('You do not have permission to manage the whitelist.');
                if(!validator.isEmail(email as any)) throw new GraphQLError('Invalid email address! Please provide a valid email address.');
                const result = await db.whitelistEmail?.create({email: email});
                return { 
                    id: result?.dataValues.id,
                    email: result?.dataValues.email,
                    createdAt: `${result?.dataValues.createdAt}`,
                    updatedAt: `${result?.dataValues.updatedAt}`
                };
            } catch (error: any) {
                throw new GraphQLError(error?.errors[0]?.message);
            }
        },
        deleteWhitelistEmail: async function deleteWhitelistEmail(_root: any, data: any, context: Context): Promise<Response>{
            if (!context.auth) throw new GraphQLError('Unauthorized Access! Please login to continue.');
            try {
                if(!context.permissions.usersAcc.manageWhitelist) throw new GraphQLError('You do not have permission to manage the whitelist.');
                
                let result: any;
                if(data.id) result = await db.whitelistEmail?.destroy({where: {id: data.id}});
                else if(data.email) result = await db.whitelistEmail?.destroy({where: {email: data.email}});
                
                return { status: result === 1 ? 'ok' : 'error', message: result === 1 ? 'Email deleted successfully.' : 'Error while deleting the email.'};
            } catch (error: any) {
                throw new GraphQLError(error);
            }
        }
    }
}
