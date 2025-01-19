import { GraphQLError } from "graphql";
import { Context } from "../context";

export const resolver = {
    Query: {
        ping: (_root: any, data: any, context: Context): string => {
            console.log(context);
            if (!context.auth) throw new GraphQLError('Unauthorized Access! Please login to continue.');
            return 'pong!'; 
        },
    }
}