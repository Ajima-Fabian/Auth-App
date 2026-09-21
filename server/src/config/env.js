import "dotenv/config"
import {z} from "zod"

const envSchema = z.object({
    NODE_ENV: z
        .enum(["development", "test", "production"])
        .default("development"),

    PORT: z.coerce
        .number()
        .int()
        .positive()
        .default(5000),

    MONGO_URI: z
        .string()
        .min(1, "MONGO_URI is required"),

    CLIENT_URL: z
        .string()
        .url("CLIENT_URL must be a valid url"),

    JWT_SECRET: z
        .string()
        .min(32, "JWT_SECRET must be at least 32 characters"),

    ACCESS_TOKEN_EXPIRY: z
        .string()
        .min(1),

    ACCESS_TOKEN_COOKIE_MAX_AGE_MS: z.coerce
        .number()
        .int()
        .positive(),

    REFRESH_TOKEN_EXPIRY_DAYS: z.coerce
        .number()
        .int()
        .positive()
        .default(7),

    SESSION_EXPIRY_DAYS: z.coerce
        .number()
        .int()
        .positive()
        .default(30)
})


const parsedEnv = envSchema.safeParse(process.env)

if(!parsedEnv.success){
    console.error(
        "Invalid environment configuration",
        parsedEnv.error.flatten().fieldErrors
    )

    process.exit(1)
}

export const env = parsedEnv.data