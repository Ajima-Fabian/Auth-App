import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    familyId: {
        type: String,
        required: true,
        index: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: true
    },
    revokedAt: {
        type: Date,
        default: null
    }
}, {timestamps: true})

const Session = mongoose.model("Session", sessionSchema)
export default Session