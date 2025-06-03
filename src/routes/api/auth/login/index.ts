import { Request, Response } from "express";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import db from "../../../../db";


export async function login(req: Request, res: Response): Promise<any> {
    if(!req.body.email || !req.body.password) return res.send(JSON.stringify({ error: "Missing required fields." }));
    if(!validator.isEmail(req.body.email) && !req.body.email.includes('localhost')) return res.send(JSON.stringify({ error: "Invalid email." }));
    if(req.body.password.length < 8) return res.send(JSON.stringify({ error: "Invalid password length." }));
    try {
        let dbUserData: any = await db.user?.findAll({where: { email: req.body.email}});
        if(!dbUserData[0]?.dataValues) return res.send(JSON.stringify({ error: "Invalid email or password." }));
    
        const passHash: string = dbUserData[0]?.dataValues.password;
        if(!bcrypt.compareSync(req.body.password, passHash)) return res.send(JSON.stringify({error: "Invalid email or password."}));
    
        const sessionPayload = {
            userId: dbUserData[0]?.dataValues.id,
        }
        
        const session_token = jwt.sign(sessionPayload, process.env.JWT_SESSION_SECRET || '', { expiresIn: '15d' }); // Session valid for 15 days
        const days = 15 * 24 * 60 * 60 * 1000;
    
        res.cookie('session', session_token, { maxAge: days });
        res.send(JSON.stringify({ success: "Logged in successfully!" }));
    } catch (error) {
        console.log(`ERROR (/api/auth/login): ${error}`);
        res.send(JSON.stringify({error: "Something went wrong!"}));  
    }
}