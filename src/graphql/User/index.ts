import { schema } from "./schema";
import { resolver } from "./resolver";

export { schema as userSchema , resolver as userResolver }

export interface User {
    id: number;
    username: string;
    email: string;
    level: number;
    permissions: UserPermissions;
    createdAt: string;
    updatedAt: string;
}

export interface UserPermissions{
    usersAcc: UserAccountPermissions
    tables: UserTablePermissions
}

export interface UserAccountPermissions{
    manage: boolean;
    managePermissions: boolean;
    manageWhitelist: boolean;  
}

export interface UserTablePermissions{
    create: boolean;
    read: boolean;
    writeIn: boolean;
    manage: boolean;
    manageUserPermissions: boolean;
}