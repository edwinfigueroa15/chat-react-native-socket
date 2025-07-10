import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
    },
    firstName: String,
    lastName: String,
    password: String,
    avatar: String,
}, {
    timestamps: true,
});

export const User = mongoose.model('User', UserSchema);