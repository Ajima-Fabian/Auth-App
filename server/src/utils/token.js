import jwt from "jsonwebtoken";
import crypto from "crypto"
import { env } from "../config/env.js";

export const generateAccessToken = (userId, sessionId) => {
    return jwt.sign(
        {
            sub: userId.toString(),
            sid: sessionId.toString(),
            type: "access"
        },
        env.JWT_SECRET,
        {
            expiresIn: env.ACCESS_TOKEN_EXPIRY
        }
    );
};

export const generateRefreshToken = () => {
    return crypto.randomBytes(64).toString("hex")
}

export const generateTokenFamily = () => {
    return crypto.randomUUID()
}

export const generatePasswordResetToken = () => {
    return crypto.randomBytes(32).toString("hex")
}

export const hashToken = (token) => {
    return crypto
        .createHash("sha256")
        .update(token)
        .digest("hex")
}