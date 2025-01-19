// --- Types ---
import { Sequelize, ModelCtor, Model } from 'sequelize';
import bcrypt from "bcryptjs";

// --- Models ---
import { initializeUserModel } from './Models/User';
import { initializeTablesModel } from './Models/Tables';
import { initializeTablePermissionsModel } from './Models/TablePermissions';
import { initializeWhitelistEmailModel } from './Models/WhitelistEmail';
import { initializeOtpModel } from './Models/Otp';

export class Database {
    public sequelize: Sequelize = {} as Sequelize;

    public whitelistEmail: ModelCtor<Model<any, any>> = {} as ModelCtor<Model<any, any>>;
    public user: ModelCtor<Model<any, any>> = {} as ModelCtor<Model<any, any>>;
    public tables: ModelCtor<Model<any, any>> = {} as ModelCtor<Model<any, any>>;
    public tablePermissions: ModelCtor<Model<any, any>> = {} as ModelCtor<Model<any, any>>;
    public otp: ModelCtor<Model<any, any>> = {} as ModelCtor<Model<any, any>>;

    public async initialize(){ // because constructor can't be async
        let dbConfig = {
            host: process.env.DATABASE_HOST || "127.0.0.1",
            name: process.env.DATABASE_NAME || '',
            user: process.env.DATABASE_USER || '',
            password: process.env.DATABASE_PASSWORD || ''
        };

        this.sequelize = new Sequelize(dbConfig.name, dbConfig.user, dbConfig.password, {
            host: dbConfig.host,
            dialect: 'postgres',
            define: {
                freezeTableName: true
            }
        });

        try {
            await this.sequelize.authenticate();
            console.log(`Database connection has been established successfully with ${dbConfig.host}:${dbConfig.name}`);
        } catch (error) {
            console.log(`Unable to connect with database ${dbConfig.host}:${dbConfig.name}\nERROR: ${error}`)
        }
        
        this.whitelistEmail = initializeWhitelistEmailModel(this.sequelize);
        this.otp = initializeOtpModel(this.sequelize);
        this.user = initializeUserModel(this.sequelize);
        this.tables = initializeTablesModel(this.sequelize);
        this.tablePermissions = initializeTablePermissionsModel(this.sequelize);

        await this.sequelize.sync({alter: true});

        
        let normalData = await this.user.findOne({ where: { email: `${process.env.NORMALUSER_NAME || 'john'}@bizdataportal.ddns.net` }});
        if(!normalData?.dataValues){
            let saltNormalPass: string = bcrypt.genSaltSync(10);
            let hashNormalPass: string = bcrypt.hashSync(process.env.NORMALUSER_PASSWORD || 'john', saltNormalPass);
            let normalUserData: any = await db.user?.create({ username: process.env.NORMALUSER_NAME || 'john', email: `${process.env.NORMALUSER_NAME || 'john'}@bizdataportal.ddns.net`, password: hashNormalPass, level: 0, permissions: { usersAcc: { manage: false, managePermissions: false, manageWhitelist: false }, tables: { create: true, read: true, writeIn: true, manage: true, manageUserPermissions: true } } });
            if(normalUserData?.dataValues.email) console.log(` - User 'john' created!`);
        }
        else console.log(` - User 'john' already exists!`);

        let adminData = await this.user.findOne({ where: { email: `${process.env.ADMINUSER_NAME || 'admin'}@bizdataportal.ddns.net` }});
        if(!adminData?.dataValues){
            let saltAdminPass: string = bcrypt.genSaltSync(10);
            let hashAdminPass: string = bcrypt.hashSync(process.env.ADMINUSER_PASSWORD || 'admin', saltAdminPass);
            let adminUserData: any = await db.user?.create({ username: process.env.ADMINUSER_NAME || 'admin', email: `${process.env.ADMINUSER_NAME || 'admin'}@bizdataportal.ddns.net`, password: hashAdminPass, level: 999, permissions: { usersAcc: { manage: true, managePermissions: true, manageWhitelist: true }, tables: { create: true, read: true, writeIn: true, manage: true, manageUserPermissions: true } } });
            if(adminUserData?.dataValues.email) console.log(` - User 'admin' created!`);
        }
        else console.log(` - User 'admin' already exists!`);
    }
}

const db: Database = new Database();
export default db;