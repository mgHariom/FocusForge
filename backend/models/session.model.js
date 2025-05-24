import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        default: 'Untitled Sessions',
    },
    completedAt: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model('Session', sessionSchema);