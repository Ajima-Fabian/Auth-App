import mongoose from "mongoose";
import { env } from "./env.js";

const connectDB = async () => {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    try {
        const mongoDB = await mongoose.connect(env.MONGO_URI);

        console.log(
            `MongoDB connection successful: ${mongoDB.connection.host}`
        );

        return mongoDB.connection;
    } catch (err) {
        console.error("MongoDB connection failed:", err.message);
        throw err;
    }
};

export default connectDB;
