import mongoose from 'mongoose';

const ChatMessageSchema = new mongoose.Schema({
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    message: String,
    type: {
        type: String,
        enum: ['text', 'image', 'video', 'audio', 'file'],
        default: 'text',
    },
    read: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

export const ChatMessage = mongoose.model('ChatMessage', ChatMessageSchema);