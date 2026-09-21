import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import Session from '../models/Session.js'
import { env } from '../config/env.js'

export const protect = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated"
            })
        }

        const decoded = jwt.verify(
            token,
            env.JWT_SECRET
        )

        if(
            decoded.type !== "access" ||
            !decoded.sub || 
            !decoded.sid
        ){
            return res.status(401).json({
                success: false,
                message: "Invalid access token"
            })
        }

        const session = await Session.findOne({
            _id: decoded.sid,
            userId: decoded.sub,
            revokedAt: null,
            expiresAt: {
                $gt: new Date()
            }
        })

        if(!session){
            return res.status(401).json({
                success: false,
                message: "Session not found"
            })
        }

        if(session.revokedAt){
            return res.status(401).json({
                success: false,
                message: "Session has been revoked"
            })
        }

        if(session.expiresAt <= new Date()){
            return res.status(401).json({
                success: false,
                message: "Session has expired"
            })
        }

        if(session.userId.toString() !== decoded.sub){
            return res.status(401).json({
                success: false,
                message: "Invalid session"
            })
        }

        const user = await User.findById(decoded.sub)

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            })
        }

        if (
                user.passwordChangedAt &&
                Math.floor(user.passwordChangedAt.getTime() / 1000
                ) > decoded.iat
            ) {
            return res.status(401).json({
                success: false,
                message: "Password recently changed, Please Log in again"
            })
        }

        req.user = {
            userId: user._id,
            sessionId: session._id
        }

        next()

        
    } catch (err) {
        console.error("Invalid or expired token", err)
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        })
    }
}