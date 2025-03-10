import * as cookie from 'cookie';
import verifyToken from '../lib/jwt';

import db from '../db';
import { User } from './User';

export async function setHttpContext({ req }: { req: any}): Promise<Context>{
	try {
		if(req.headers.cookie) {
			const cookies = cookie.parse(req.headers.cookie);
			if (cookies?.session) {
				const result: any = await verifyToken(cookies?.session, process.env.JWT_SESSION_SECRET || '');   
				if(result?.userId){
					const userData: any = await db.user?.findOne({ where: { id: result.userId } });
					userData.dataValues.permissions = userData?.dataValues.permissions;
					return { ...userData.dataValues, auth: true}; // adding auth to the context
				}
			}
		}
	} catch (error) {
		console.log('[CONTEXT] Error: ', error.message);
		return {auth: false} as any;
	}
	return {auth: false} as any;
}

export interface Context extends User {
	auth: boolean;
}
