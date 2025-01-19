import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';

import { rootSchema, rootResolver } from './_root';
import { responseSchema } from './Response';
import { userResolver, userSchema } from './User';
import { whitelistResolver, whitelistSchema } from './Whitelist';
import { tableResolver, tableSchema } from './Table';


export const schema = mergeTypeDefs([rootSchema, responseSchema, userSchema, whitelistSchema, tableSchema]);
export const resolver = mergeResolvers([rootResolver, whitelistResolver, userResolver, tableResolver]);
