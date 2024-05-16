export const schema = /* GraphQL */`
    type Query {
        getTables: [Table]
        getTable(id: ID!): Table
        readTable(id: ID!): TableData
        getTableUsers(tableId: ID!): [TableUser] # u won't get admin user here
    }

    type Mutation {
        createTable(name: String!, fields: String): Table
        editTable(id: ID!, table: String): Table # table is a string field of JSON (object)
        writeInTable(id: ID!, rows: String!): TableData # rows is a string field of JSON (2D array)
        editRows(id: ID!, rows: String!): TableData
        addTableUser(tableId: ID!, userId: ID!): TableUser
        editTableUserPermissions(tableId: ID!, userId: ID!, permissions: String!): TableUser
        removeTableUser(tableId: ID!, userId: ID!): TableUser
    }

    type Table{
        id: ID
        ownerId: ID
        name: String
        description: String
        fields: [TableFields]
        totalFields: Int
    }

    type TableUser{
        id: ID!
        username: String
        email: String
        permissions: TablePermissions
    }

    type TablePermissions{
        writeEntry: Boolean,
        manageRows: Boolean,
        manageFields: Boolean,
        manageTable: Boolean,
        manageUsers: Boolean
    }

    type TableFields{
        id: ID
        title: String
        dataType: String
        defaultValue: String
    }

    type TableData{
        id: ID
        rows: [[FieldsData]]
    }

    type FieldsData{
        rowId: ID
        fieldId: ID
        title: String
        value: String
        createdat: String
        updatedat: String
    }
`;