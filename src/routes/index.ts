import { Express } from 'express';
import apiRouter from './api/auth';

export default async function initializeRoutes(app: Express){
    app.use('/api/auth', apiRouter);
}