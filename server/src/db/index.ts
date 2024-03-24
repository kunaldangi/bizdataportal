// --- Types ---
import { Sequelize, ModelCtor, Model } from 'sequelize';

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
    }
}

const db: Database = new Database();
export default db;