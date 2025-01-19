import { GraphQLError } from "graphql";

import db from "../../../db";

import { TablePermissions, TableUser} from "..";
import { Context } from "../../context";
import { User } from "../../User";

export const Delete = {
    Mutation: {
        removeTableUser: async (_root: any, data: {tableId: number, userId: number}, context: Context): Promise<TableUser> => {
            if(!context.auth) throw new GraphQLError('Unauthorized Access! Please login to continue.');
            try{
                let contextTablePrm: TablePermissions = (await db.tablePermissions.findOne({where: {tableId: data.tableId, userId: context.id}}))?.dataValues?.permissions;
                if(!contextTablePrm?.manageUsers && !context.permissions.tables.manageUserPermissions) throw new GraphQLError('You do not have permission to manage users for this table.'); // u need admin permission or table manage user permission

                let user: User = (await db.user.findByPk(data.userId))?.dataValues;
                if(!user) throw new GraphQLError('User not exists.');

                let usrTablePermReuslt = await db.tablePermissions.findOne({where: {tableId: data.tableId, userId: data.userId}});
                if(!usrTablePermReuslt) throw new GraphQLError('User not found in the table!');

                let usrTablePerm: TablePermissions = usrTablePermReuslt?.dataValues?.permissions;
                if(user.permissions.tables.manageUserPermissions) throw new GraphQLError('You cannot remove this user from the table.'); // check if user is admin
                if(!context.permissions.tables.manageUserPermissions && usrTablePerm.manageUsers) throw new GraphQLError('You cannot remove this user from the table.'); // check context is not admin and user have manage table user permission
                
                await usrTablePermReuslt.destroy();

                return {id: user.id, username: user.username, email: user.email, permissions: usrTablePerm};
            }
            catch(error: any){
                throw new GraphQLError(error);
            }
        }
    }
};