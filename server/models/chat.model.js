import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
    user_one: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    user_two: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
});

export const Chat = mongoose.model('Chat', ChatSchema);