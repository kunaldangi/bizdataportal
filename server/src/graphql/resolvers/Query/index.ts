import { GraphQLError } from "graphql";

import { getWhitelistEmails } from "../Whitelist";
import { getUsers } from "../User";

export const Query = {
    ping: (_root: any, data: any, context: any): string => {
        if (!context.auth) throw new GraphQLError('Unauthorized');
        return 'pong!'; 
    },
    getWhitelistEmails: getWhitelistEmails,
    getUsers: getUsers
}
