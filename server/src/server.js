import app from "./app.js"
import connectDB from "./config/db.js"
import { env } from "./config/env.js"

const PORT = env.PORT || 5000

const startServer = async () => {
    await connectDB()
    const server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })

    const shutdown = async (signal) => {
        console.log(`${signal} recieved. Shutting down....`)

        server.close( async () => {
            await import("mongoose").then(({default:mongoose}) => mongoose.connection.close())

            process.exit(0);
        })
    }

    process.on("SIGTERM", () => shutdown("SIGTERM"))
    process.on("SIGINT", () => shutdown("SIGINT"))
}

startServer()