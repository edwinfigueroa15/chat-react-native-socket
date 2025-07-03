import jwt from 'jsonwebtoken';

export const generateToken = (payload, expiresIn = '24h') => {
    return jwt.sign(
        payload,
        process.env.JWT_SECRET_KEY,
        { expiresIn }
    );
};

export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET_KEY, true);
};
