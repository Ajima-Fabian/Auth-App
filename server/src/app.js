import express from 'express'
import helmet from "helmet"
import cookieParser from 'cookie-parser'
import cors from 'cors'
import authRoutes from './routes/authRoutes.js'
import { env } from './config/env.js'

const app = express()

app.use(cors({
    origin: env.CLIENT_URL,
    credentials: true
}))
app.use(helmet())
app.use(express.json({
    limit: "10kb"
}))
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use("/api/health", (req, res) => {
    res.json({
        status: 'Ok',
        message: 'Auth App API is running'
    })
})

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    })
})

export default app