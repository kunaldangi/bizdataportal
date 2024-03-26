export const schema = /* GraphQL */`
    type Mutation {
        createTable(name: String!, fields: String): Table
    }

    type Table{
        id: ID
        ownerId: ID
        name: String
        description: String
        fields: [TableFields]
    }

    type TableFields{
        title: String
        dataType: String
        defaultValue: String
    }
`;