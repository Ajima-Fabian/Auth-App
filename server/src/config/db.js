import mongoose from "mongoose";
import { env } from "./env.js";

const connectDB = async() => {
    try{
       const mongoDB = await mongoose.connect(env.MONGO_URI)

       console.log(`MongoB connection successful: ${mongoDB.connection.host}`)

    } catch(err){
        console.error('MongoDB connection failed:', err.message)
        process.exit(1)
    }
}

export default connectDB