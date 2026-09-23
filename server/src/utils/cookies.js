import { env } from "../config/env.js"

const isProduction = env.NODE_ENV === "production"

const cookieOption = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax"
}

export const clearAuthCookies = (res) => {
    res.clearCookie("accessToken", cookieOption)
    res.clearCookie("refreshToken", cookieOption)
}

export const setAuthCookies = (res, {
    accessToken,
    refreshToken
}) => {
    res.cookie("accessToken", accessToken, {
        ...cookieOption,
        maxAge: env.ACCESS_TOKEN_COOKIE_MAX_AGE_MS * 60 * 1000
    })

    res.cookie("refreshToken", refreshToken, {
        ...cookieOption,
        maxAge: env.REFRESH_TOKEN_EXPIRY_DAYS *
            24 *
            60 *
            60 *
            1000
    })
}
