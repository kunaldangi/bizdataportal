export const schema = /* GraphQL */`
    type Query {
        getTables: [Table]
        getTable(id: ID): Table
    }

    type Mutation {
        createTable(name: String!, fields: String): Table
        # viewTable(id: ID!): Table,
        # viewTables
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