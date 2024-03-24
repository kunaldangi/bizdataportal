import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import db from "../../../../db";
import verifyToken from "../../../../lib/jwt";

export async function verify(req: Request, res: Response){
    console.log(req.cookies?.otp_token);
    if (!req.cookies?.otp_token) return res.send(JSON.stringify({ error: "Something went wrong!" }));
    if (!req.body.code) return res.send(JSON.stringify({ error: "Invalid OTP code." }));

    let otp_data: any;
    try { otp_data = await verifyToken(req.cookies?.otp_token, process.env.JWT_OTP_SECRET || ''); } catch (error) { return res.send(JSON.stringify({ error: "Invalid OTP code." })); }
    if((otp_data.exp - (Date.now() / 1000)) < 0) return res.send({ error: "OTP expired!" });

    try {
        let getDbOtp: any = await db.otp?.findAll({ where: { email: otp_data.email, code: req.body.code } });
        if(req.body.code !== getDbOtp[0]?.dataValues.code || !getDbOtp[0]?.dataValues) return res.send(JSON.stringify({ error: "Invalid OTP code." }));
        
        let saltPass: string = bcrypt.genSaltSync(10);
        let hashPass: string = bcrypt.hashSync(otp_data.password, saltPass);
    
        await db.otp?.destroy({ where: { email: otp_data.email } });
        await db.whitelistEmail?.destroy({ where: { email: otp_data.email } });
        let userData: any = await db.user?.create({ username: otp_data.username, email: otp_data.email, password: hashPass, type: 1 });
    
        if(userData?.dataValues.email){
            res.clearCookie('otp_token');
            return res.send(JSON.stringify({ success: "Account created successfully!"}));
        }
    
        res.send(JSON.stringify({error: "Something went wrong!"}));
    } catch (error) {
        console.log(`ERROR (/api/auth/verify): ${error}`);
        return res.send(JSON.stringify({error: "Something went wrong!"}));
    }
}