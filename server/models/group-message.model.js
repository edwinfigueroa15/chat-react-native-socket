import mongoose from 'mongoose';

const GroupMessageSchema = new mongoose.Schema({
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
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
    readBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
}, {
    timestamps: true,
});

export const GroupMessage = mongoose.model('GroupMessage', GroupMessageSchema);