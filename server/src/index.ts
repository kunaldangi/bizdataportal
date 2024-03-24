// ----- Libs ----- // 
import { config as envSetup } from "dotenv"; envSetup();
import express, { Express } from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware as apolloMiddleware } from '@apollo/server/express4';
import bodyParser from 'body-parser';
import cors from 'cors';
import { readFile } from 'fs/promises';
import cookieParser from "cookie-parser";

// ----- Custom Modules ----- //
import db from './db';
import initializeRoutes from './routes';
import graphqlResolvers from './graphql';
import { setHttpContext } from "./graphql/context";

async function main(): Promise<void> {
    const isDevMode = (process.env.SERVER_RUN_MODE === "development");
    const expressApp: Express = express(); // creating an Express server
    const port: number = 8080; // port number

    await db.initialize(); // initializing the database

    const graphqlSchema: string = await readFile('./schema.graphql', 'utf-8');

    expressApp.use(bodyParser.json()); // parsing JSON data
    expressApp.use(cors()); // enabling CORS
    expressApp.use(cookieParser()); // enabling cookie parser

    const apolloServer: ApolloServer = new ApolloServer({ typeDefs: graphqlSchema, resolvers: graphqlResolvers, includeStacktraceInErrorResponses: isDevMode}); // creating an Apollo Server instance
    await apolloServer.start(); // starting Apollo Server to handle GraphQL requests


    initializeRoutes(expressApp); // initializing routes

    expressApp.use('/graphql', apolloMiddleware(apolloServer, { context: setHttpContext }, )); // adding Apollo Server to Express

    expressApp.listen(port, (): void => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}



main();