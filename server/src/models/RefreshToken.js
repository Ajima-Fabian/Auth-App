import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
        required: true,
        index: true
    },
    tokenHash: {
        type: String,
        required: true,
        unique:true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: true
    },
    usedAt: {
        type: Date,
        default: null
    },
    revokedAt: {
        type: Date,
        default: null
    }
}, {timestamps: true})


const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema)
export default RefreshToken