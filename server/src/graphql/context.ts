import cookie from 'cookie';
import verifyToken from '../lib/jwt';

import db from '../db';

export async function setHttpContext({ req }: { req: any}){
	try {
		if(req.headers.cookie) {
			const cookies = cookie.parse(req.headers.cookie);
			if (cookies?.session) {
				const result: any = await verifyToken(cookies?.session, process.env.JWT_SESSION_SECRET || '');        
				if(result?.userId){
					const userData: any = await db.user?.findOne({ where: { id: result.userId } });
					userData.dataValues.permissions = JSON.parse(userData?.dataValues.permissions);
					return { ...userData.dataValues, auth: true};
				}
			}
		}
	} catch (error) {
		return {auth: false} as any;
	}
	return {auth: false} as any;
}
