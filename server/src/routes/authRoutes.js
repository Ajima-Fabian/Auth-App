import express from 'express'
import {
    changePassword,
    forgotPassowrd,
    getMe,
    getSessions,
    login,
    logout,
    refreshAccessToken,
    register,
    resetPassword,
    updateProfile
} from '../controllers/authController.js'
import { protect } from '../middleware/authMiddleware.js'
import { validate } from '../middleware/validate.js'
import {
    changePasswordSchema,
    forgotPasswordSchema,
    loginSchema,
    registerSchema,
    resetPasswordSchema,
    updateProfileSchema
} from '../utils/validation.js'

const router = express.Router()

router.post(
    "/register",
    validate(registerSchema),
    register
)
router.post(
    "/login",
    validate(loginSchema),
    login
)
router.get("/me", protect, getMe)
router.post("/logout", logout)
router.post("/refresh", refreshAccessToken)
router.put(
    "/profile",
    protect,
    validate(updateProfileSchema),
    updateProfile
)
router.put(
    "/password",
    protect,
    validate(changePasswordSchema),
    changePassword
)
router.get(
    "/sessions",
    protect,
    getSessions
)

router.post(
    "/forgot-password",
    validate(forgotPasswordSchema),
    forgotPassowrd
)

router.post(
    "/reset-password",
    validate(resetPasswordSchema),
    resetPassword
)
export default router