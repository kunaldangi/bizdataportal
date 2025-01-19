// ----- Libs ----- // 
import { config as envSetup } from "dotenv"; envSetup();
import express, { Express } from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware as apolloMiddleware } from '@apollo/server/express4';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from "cookie-parser";

// ----- Custom Modules ----- //
import db from './db';
import initializeRoutes from './routes';
import { schema as graphqlSchema, resolver as graphqlResolver } from './graphql';
import { setHttpContext } from "./graphql/context";
import { nextApp } from "./next";


let corsOptions = { // Cross-Origin Resource Sharing (CORS) configuration
    origin: function (origin: any, callback: any) {
        console.log("Origin: ", origin);
        if (origin === "http://localhost:8080" || origin === undefined) {
            callback(null, true)
        }
        else{
            callback(new Error('You are not allowed to access this server!'));
        }
    },
    credentials: true
}

async function main(): Promise<void> {
    const isDevMode = (process.env.SERVER_RUN_MODE === "development");
    const expressApp: Express = express(); // creating an Express server
    const port: number = 8080; // port number

    await db.initialize(); // initializing the database

    expressApp.use(bodyParser.json()); // parsing JSON data
    expressApp.use(cors(corsOptions)); // enabling CORS
    expressApp.use(cookieParser()); // enabling cookie parser

    const apolloServer = new ApolloServer({ typeDefs: graphqlSchema, resolvers: graphqlResolver, includeStacktraceInErrorResponses: isDevMode}); // creating an Apollo Server instance
    await apolloServer.start(); // starting Apollo Server to handle GraphQL requests

    
    initializeRoutes(expressApp); // initializing routes

    expressApp.use('/graphql', apolloMiddleware(apolloServer, { context: setHttpContext }, )); // adding Apollo Server to Express

    const nextHandler = await nextApp(isDevMode); // initializing Next.js
    expressApp.use(nextHandler); // adding Next.js to Express

    expressApp.listen(port, (): void => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}


main();