export const schema = /* GraphQL */ `
    type Query{
        getWhitelistEmails: [Whitelist]
    }

    type Mutation{
        addWhitelistEmail(email: String!): Whitelist
        deleteWhitelistEmail(id: ID, email: String): Response
    }

    type Whitelist{
        id: ID
        email: String
        createdAt: String
        updatedAt: String
    }
`;