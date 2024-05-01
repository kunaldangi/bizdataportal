export const schema = /* GraphQL */`
    type Query {
        getTables: [Table]
        getTable(id: ID!): Table
        viewTable(id: ID!): String
    }

    type Mutation {
        createTable(name: String!, fields: String): Table
        editTable(id: ID!, table: String): Table # table is a string field of JSON
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