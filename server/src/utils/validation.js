import {z} from 'zod'

export const registerSchema = z.strictObject({
    name: z
        .string()
        .trim()
        .min(2, "Name must be atleast 2 characters")
        .max(50, "Name must not exceed 50 characters"),
    
    email: z
        .string()
        .trim()
        .email("Please provide a valid email address")
        .transform((email) => email.toLowerCase()),

    password: z
        .string()
        .min(8, "Password must be atleast 8 characters")
        .max(128, "Password must not exceed 128 characters")
})

export const loginSchema = z.strictObject({
    email: z
        .string()
        .trim()
        .email("Please provide a valid email address")
        .transform((email) => email.toLowerCase()),
    password: z
        .string()
        .min(1, "Pasword is required")
        .max(128, "Password must not exceed 128 characters")
})

export const updateProfileSchema = z.strictObject({
     name: z
        .string()
        .trim()
        .min(2, "Name must be atleast 2 characters")
        .max(50, "Name must not exceed 50 characters"),
     email: z
        .string()
        .trim()
        .email("Please provide a valid email address")
        .transform((email) => email.toLowerCase()),
})

export const changePasswordSchema = z.strictObject({
    currentPassword: z
        .string()
        .min(1, "Pasword is required")
        .max(128, "Password must not exceed 128 characters"),
    newPassword: z
        .string()
        .min(8, "Pasword must be at least 8 characters")
        .max(128, "Password must not exceed 128 characters"),
    confirmPassword: z
         .string()
        .min(1, "Pasword is required")
        .max(128, "Password must not exceed 128 characters"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"]
})


export const forgotPasswordSchema = z.strictObject({
        email: z
            .string()
            .trim()
            .email("Please provide a valid email address")
            .transform((email) => email.toLowerCase())
})

export const resetPasswordSchema = z.strictObject({
    token: z
        .string()
        .min(1, "Reset token is required"),

    newPassword: z 
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(128, "Password must not exceed 128 characters"),

    confirmPassword: z
        .string()
        .min(1, "Password must be at least 8 characters")
        .max(128, "Password must not exceed 128 characters")
}).refine(
    (data) => data.newPassword === data.confirmPassword,
    {
        message: "Passwords do not match",
        path: ["confirmPassword"]
    }
)

