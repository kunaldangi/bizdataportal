import { schema } from "./schema";
import { resolver } from "./resolver";

export interface Whitelist{
    id: number
    email: string
    createdAt: string
    updatedAt: string
}

export {schema as whitelistSchema, resolver as whitelistResolver};