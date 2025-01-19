// --- Types ---
import { VerifyErrors, Jwt, JwtPayload, Secret, GetPublicKeyOrSecret } from "jsonwebtoken";

// --- Libraries ---
import jwt from "jsonwebtoken";

export default function verifyToken(token: string, secret: Secret | GetPublicKeyOrSecret) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err: VerifyErrors | null, decoded: Jwt | JwtPayload | string | undefined) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
}