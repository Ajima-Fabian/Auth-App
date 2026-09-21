import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import Session from '../models/Session.js'
import {
    generateAccessToken,
    hashToken,
    generateRefreshToken,
    generateTokenFamily,
    generatePasswordResetToken
} from '../utils/token.js'
import { clearAuthCookies, setAuthCookies } from '../utils/cookies.js'
import RefreshToken from '../models/RefreshToken.js'
import PasswordResetToken from '../models/PasswordResetToken.js'
import { createAuthSession, revokeSession } from '../services/authService.js'
import { env } from '../config/env.js'


//=============== REGISTER CONTROLLER



export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "An account with this email already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })

        return res.status(201).json({
            success: true,
            message: "Account created successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch (err) {
        console.error("Register error", err)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating your account"
        })
    }
}



// =============== LOGIN CONTROLLER


export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email }).select("+password")

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or passowrd"
            })
        }

        const passowrdMatch = await bcrypt.compare(password, user.password)

        if (!passowrdMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        const authSession = await createAuthSession(user._id)

        user.lastLoginAt = new Date()
        await user.save()

        setAuthCookies(res, {
            accessToken: authSession.accessToken,
            refreshToken: authSession.refreshToken
        })

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            }
        })

    } catch (err) {
        console.error("Login error", err)
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}


// =============== GETME CONTROLLER


export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        return res.status(200).json({
            success: true,
            statusCode: 200,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                lastLoginAt: user.lastLoginAt,
                passwordChangedAt: user.passwordChangedAt,
                accountStatus: "Active"
            }
        })
    } catch (err) {
        console.error("Get me error", err)

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}


// =============== LOGOUT CONTROLLER


export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken

        if(refreshToken){
            const tokenHash = hashToken(refreshToken)
            const storedRefreshToken = await RefreshToken.findOne({tokenHash})

            if(storedRefreshToken){
                await Session.findByIdAndUpdate(
                    storedRefreshToken.sessionId,
                    {
                        $set: {
                            revokedAt: new Date()
                        }
                    }
                )

                await  RefreshToken.updateMany(
                    {
                        sessionId: storedRefreshToken.sessionId,
                        revokedAt: null
                    },
                    {
                        $set:{
                            revokedAt: new Date()
                        }
                    }
                )
            }
        }
        
        clearAuthCookies(res)

        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        })

    } catch (err) {
        console.error("Logout error", err)

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

// =============== UPDATEPROFILE CONTROLLER


export const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body

        const existingUser = await User.findOne({
            email,
            _id: { $ne: req.user.userId }
        })

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "An account with the email already exists"
            })
        }

        const user = await User.findByIdAndUpdate(req.user.userId, { name, email }, {
            new: true,
            runValidators: true
        })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                lastLoginAt: user.lastLoginAt,
                passwordChangedAt: user.passwordChangedAt,
            }
        })
    } catch (err) {
        console.error("Update profile error", err)

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}


// =============== CHANGEPASSWORD CONTROLLER


export const changePassword = async (req, res) => {
    try {
        const {
            currentPassword,
            newPassword
        } = req.body

        const user = await User.findById(req.user.userId).select("+password")

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        const passowrdMatch = await bcrypt.compare(
            currentPassword,
            user.password
        )

        if(!passowrdMatch){
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect"
            })
        }

        const samePassword = await bcrypt.compare(
            newPassword,
            user.password
        )

        if(samePassword){
            return res.status(401).json({
                success: false,
                message: "New password must be different from your old password"
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12)

        const passwordChangedAt = new Date()
        passwordChangedAt.setMilliseconds(0)

        user.password = hashedPassword
        user.passwordChangedAt = passwordChangedAt

        await user.save()


        const sessions = await Session.find({
            userId: user._id,
            revokedAt: null
        }).select("_id")

        const sessionIds = sessions.map((session) => session._id)

        if(sessionIds.length > 0){
            const now = new Date()

            await Session.updateMany(
                {
                    _id: {
                        $in: sessionIds
                    },
                    revokedAt: null
                },
                {
                    $set: {
                        revokedAt: now
                    }
                }
            )

            await RefreshToken.updateMany(
                {
                    sessionId: {
                        $in: sessionIds
                    },
                    revokedAt: null
                },
                {
                    $set: {
                        revokedAt: now
                    }
                }
            )
        }


        clearAuthCookies(res)

        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        })


    } catch (err) {
        console.error("Error changing password", err)
        return res.status(500).json({
            success: false,
            message: err.message || "Something went wrong, please try again"
        })
    }
}


// =============== REFRESHACCESSTOKEN


export const refreshAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                success:  false,
                message: "Refresh token not found"
            })
        }

        const tokenHash = hashToken(refreshToken)
        const storedRefreshToken = await RefreshToken.findOne({tokenHash})

        if(!storedRefreshToken){
            return res.status(401).json({
                success: false,
                message: "Invalid refresh token"
            })
        }

        if(storedRefreshToken.revokedAt){
            return res.status(401).json({
                success: false,
                message: "Refresh token has already been revoked"
            })
        }

       if(storedRefreshToken.expiresAt <= new Date()){
            return res.status(401).json({
                success: false,
                message: "Refresh token expired"
            })
       }

       if(storedRefreshToken.usedAt){
            await revokeSession(storedRefreshToken.sessionId)
            clearAuthCookies(res)

            return res.status(401).json({
                success: false,
                message: "Session expired. Please sign in again"
            })
       }
       

        const claimRefreshToken = await RefreshToken.findOneAndUpdate(
            {
                _id: storedRefreshToken._id,
                usedAt: null,
                revokedAt: null,
                expiresAt: {
                    $gt: new Date()
                }
            },
            {
                $set: {
                    usedAt: new Date()
                }
            },
            {
                new: true
            })

        if(!claimRefreshToken){
            return res.status(401).json({
                success: false,
                message: "Refresh token has already been used"
            })
        }


        const session = await Session.findById(storedRefreshToken.sessionId)

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
                message: "Refresh token expired"
            })
        }

        const user = await User.findById(session.userId)

        if(!user){
            return res.status(401).json({
                success: false,
                message: "User not found"
            })
        }

        const newRefreshToken = generateRefreshToken()
        const newTokenHash = hashToken(newRefreshToken)

        const now = Date.now()

        const refreshTokenExpiresAt = new Date(
            Math.min(
                now + 
                env.REFRESH_TOKEN_EXPIRY_DAYS *
                24 *
                60 *
                60 *
                1000,
                session.expiresAt.getTime()
            )
        )

        await RefreshToken.create({
            sessionId:  session._id,
            tokenHash: newTokenHash,
            expiresAt: refreshTokenExpiresAt
        })

        const newAccessToken = generateAccessToken(
            user._id, 
            session._id
        )

        setAuthCookies(res, {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        })

        return res.status(200).json({
            success: true,
            message: "Access token refreshed"
        })

    } catch (err) {
        console.error("Refresh token error", err)
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}


// =============== GET USER SESSIONS


export const getSessions = async (req, res) => {
    try{
        const sessions = await Session.find({
            userId: req.user.userId,
            revokedAt: null,
            expiresAt: {
                $gt: new Date()
            }
        }).sort({createdAt: -1})
        .select("_id createdAt expiresAt familyId")

        return res.status(200).json({
            success: true,
            sessions: sessions.map((session) => ({
                id: session._id,
                createdAt: session.createdAt,
                expiresAt: session.expiresAt,
                familyId: session.familyId
            }))
        })
    }catch (err){
        console.error("Get sessions error", err)
        return res.status(500).json({
            success: false,
            message: "Unable to retrieve sessions"
        })
    }
}



//=====================FORGOT PASSWORD


export const forgotPassowrd = async (req, res) => {
    try{
        const {email} = req.body
        const user = await User.findOne({email})


        if(!user){
            return res.status(200).json({
                success: true,
                message: "If an account with that email exists, a password reset link has been sent"
            })
        }

        await PasswordResetToken.deleteMany({
            userId: user._id,
            usedAt: null
        })

        const resetToken = generatePasswordResetToken()

        const tokenHash = hashToken(resetToken)

        const expiresAt = new Date(
            Date.now() + 15 * 60 * 1000
        )

        await PasswordResetToken.create({
            userId: user._id,
            tokenHash,
            expiresAt
        })

        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`

        console.log("Password reset url")
        console.log(resetUrl)

        return res.status(200).json({
            success: true,
            message: "If an account with that email exists, a password reset link has been sent"
        })
    }catch(err){
        console.error("Forgot password error")
        return res.status(500).json({
            success: false,
            message: "Unable to process password reset request"
        })
    }
}



// ==================RESET PASSWORD


export const resetPassword = async(req, res) => {
    try{
        const {token, newPassword} = req.body

        if(!token){
            return res.status(400).json({
                success: false,
                message: "Password reset token is required"
            })
        }
        const tokenHash = hashToken(token)

        const resetToken = await PasswordResetToken.findOne({
            tokenHash,
            usedAt: null,
            expiresAt: {
                $gt: new Date()
            }
        })

        if(!resetToken){
            return res.status(400).json({
                success: false,
                message: "Invalid or expired password reset token"
            })
        }

        if(resetToken.expiresAt <= new Date()){
            return res.status(400).json({
                success: false,
                message: "Invalid or expired password reset token"
            })
        }

        const user = await User.findById(resetToken.userId).select("+password")

        if(!user){
            return res.status(400).json({
                success: false,
                message: "Invalid or expired password reset token"
            })
        }

        const samePassword = await bcrypt.compare(newPassword, user.password)

        if(samePassword){
            return res.status(400).json({
                success: false,
                message: "New password must be different from your current password"
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12)

        user.password = hashedPassword
        const passwordChangedAt = new Date()
        passwordChangedAt.setMilliseconds(0)
        user.passwordChangedAt = passwordChangedAt
        
        await user.save()

        resetToken.usedAt = new Date()
        await resetToken.save()


       const sessions = await Session.find({
        userId: user._id,
        revokedAt: null
       }).select("_id")
    
       const sessionIds = sessions.map(session => session._id)
        
       if(sessionIds.length > 0){
        await Session.updateMany({
            _id: {
                $in: sessionIds
            }
        }, {
            $set: {
                revokedAt: new Date()
            }
        })
       }

        await RefreshToken.updateMany({
            sessionId: {
                $in: sessionIds
            },
            revokedAt: null
        }, {
            $set: {
                revokedAt: new Date()
            }
        })


        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        })

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        })

        return res.status(200).json({
            success: true,
            message: "Password reset successfully. Please log in again"
        })
    }catch(err){
        console.error("Reset password error", err)
        return res.status(500).json({
            success: false,
            message: "Unable to reset password"
        })
    }
}