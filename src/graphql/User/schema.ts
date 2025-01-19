export const schema = /* GraphQL */`
    type Query{
        getUsers: [User]
        getUser(id: ID, email: String): User
    }

    type Mutation{
        deleteUser(id: ID, email: String): Response
        updateUser(id: ID, email: String, userData: String!): User
    }

    type User{
        id: ID
        username: String
        email: String
        level: Int
        permissions: UserPermissions
        createdAt: String
        updatedAt: String
    }

    type UserPermissions{
        usersAcc: UserAccountPermissions
        tables: UserTablePermissions
    }

    type UserAccountPermissions{
        manage: Boolean, 
        managePermissions: Boolean, 
        manageWhitelist: Boolean  
    }

    type UserTablePermissions{
        create: Boolean
        read: Boolean
        writeIn: Boolean
        manage: Boolean
        manageUserPermissions: Boolean
    }
`;

