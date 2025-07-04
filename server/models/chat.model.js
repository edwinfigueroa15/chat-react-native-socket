import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
    userOne: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    userTwo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
}, {
    timestamps: true,
});

export const Chat = mongoose.model('Chat', ChatSchema);