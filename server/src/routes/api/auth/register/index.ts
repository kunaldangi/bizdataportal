import { Request, Response } from "express";
import validator from "validator";
import jwt from "jsonwebtoken";

import db from "../../../../db";
import { generate_otp_code, OTPType } from "../../../../lib/otp";
import { send_mail } from "../../../../lib/mail";

export async function register(req: Request, res: Response){
    try {
        if (!req.body.username || !req.body.password || !req.body.email) return res.send(JSON.stringify({ error: "Missing required fields." }));
        if (!validator.isEmail(req.body.email)) return res.send(JSON.stringify({ error: "Invalid email." }));
        if (!validator.isAlpha(req.body.username, "en-US")) return res.send(JSON.stringify({ error: "Invalid username." }));
        if (req.body.password.length < 8) return res.send(JSON.stringify({ error: "Invalid password length." }));

        let checkWhitelist = await db.whitelistEmail.findOne({ where: { email: req.body.email } });
        if(checkWhitelist?.dataValues.email !== req.body.email) return res.send(JSON.stringify({ error: "Email not whitelisted." }));

        const otp_code: number = generate_otp_code();
        const otp_payload = {
            type: OTPType.RegisterUser,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        };

        await db.otp?.destroy({ where: { email: req.body.email } });
        const otp = await db.otp?.create({ type: otp_payload.type, code: otp_code, email: otp_payload.email });

        if(!otp?.dataValues) return res.send(JSON.stringify({ error: "Something went wrong." }));

        let email_status: any = await send_mail({
            from: process.env.GMAIL_ID,
            to: req.body.email,
            subject: "Verfication code",
            text: `Your one time password for registering your account at bizdataportal is ${otp_code}. This code will expire in 1 hour.`
        });

        if (email_status.accepted == req.body.email) {
            const otp_token: string = jwt.sign(otp_payload, process.env.JWT_OTP_SECRET || '', { expiresIn: '1h' });
            const oneHour: number = 60 * 60 * 1000;
            res.cookie('otp_token', otp_token, { maxAge: oneHour });
            return res.send(JSON.stringify({ success: "OTP sent to your email." }));
        }
        else {
            res.send(JSON.stringify({ error: "Error sending OTP to your email." }));
        }

        return res.send(JSON.stringify({ error: "Something went wrong." }));
    } catch (error) {
        console.log(`ERROR (/api/auth/register): ${error}`);
        return res.send(JSON.stringify({error: "Something went wrong!"}));
    }
}