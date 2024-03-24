import { Query } from "./resolvers/Query"; // For reading data
import { Mutation } from "./resolvers/Mutation"; // For writing data
import { User } from "./resolvers/User";

const resolvers = {
    Query: Query,
    Mutation: Mutation,
    User: User
};
export default resolvers;