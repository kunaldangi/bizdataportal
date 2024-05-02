export const schema = /* GraphQL */`
    type Query {
        getTables: [Table]
        getTable(id: ID!): Table
        readTable(id: ID!): TableData
    }

    type Mutation {
        createTable(name: String!, fields: String): Table
        editTable(id: ID!, table: String): Table # table is a string field of JSON (object)
        writeInTable(id: ID!, rows: String!): TableData # rows is a string field of JSON (2D array)
    }

    type Table{
        id: ID
        ownerId: ID
        name: String
        description: String
        fields: [TableFields]
        totalFields: Int
    }

    type TableFields{
        id: ID
        title: String
        dataType: String
        defaultValue: String
    }

    type TableData{
        id: ID
        rows: [[TableFieldsData]]
    }

    type TableFieldsData{
        id: ID
        value: String
    }
`;