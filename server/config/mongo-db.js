import mongoose from 'mongoose';

export async function connectMongoDB() {
    let mongoURI = `${process.env.DB_DRIVER}://`;
    if (process.env.DB_USER && process.env.DB_PASS) mongoURI += `${process.env.DB_USER}:${process.env.DB_PASS}@`;
    if (process.env.DB_HOST) mongoURI += `${process.env.DB_HOST}`;
    if (process.env.DB_PORT) mongoURI += `:${process.env.DB_PORT}`;
    if (process.env.DB_NAME) mongoURI += `/${process.env.DB_NAME}`;

    try {
        await mongoose.connect(mongoURI);
        console.log('*** Connected to MongoDB successfully ***');

    } catch (err) {
        console.error('*** Error connecting to MongoDB ***:', err);
    }
}