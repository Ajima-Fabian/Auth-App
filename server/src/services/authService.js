import { env } from "../config/env.js"
import RefreshToken from "../models/RefreshToken.js"
import Session from "../models/Session.js"
import { 
            generateAccessToken, 
            generateRefreshToken, 
            generateTokenFamily, 
            hashToken 
        } from "../utils/token.js"

export const revokeSession = async (sessionId) => {
    const now = new Date()

    await Session.findByIdAndUpdate(
        sessionId,
        {
            $set: {
                revokedAt: now
            }
        }
    )


    await RefreshToken.updateMany(
        {
            sessionId,
            revokedAt: null
        },
        {
            $set: {
                revokedAt: now
            }
        }
    )
}


export const createAuthSession = async (userId) => {
    const now = Date.now()
    const sessionExpiresAt = new Date(
        now +
        env.SESSION_EXPIRY_DAYS *
        24 *
        60 *
        60 *
        1000
    )

    const refreshToken = generateRefreshToken()

    const refreshTokenExpiresAt = new Date(

        Math.min(
            now +
            env.REFRESH_TOKEN_EXPIRY_DAYS *
            24 *
            60 *
            60 *
            1000,
            
            sessionExpiresAt.getTime()
        )
    )

    const familyId = generateTokenFamily()

    const session = await Session.create({
        userId,
        familyId,
        expiresAt: sessionExpiresAt
    })

    await RefreshToken.create({
        sessionId: session._id,
        tokenHash: hashToken(refreshToken),
        expiresAt: refreshTokenExpiresAt
    })

    const accessToken = generateAccessToken(userId, session._id)


    return {
        accessToken,
        refreshToken,
        session
    }
}