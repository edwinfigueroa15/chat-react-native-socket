import { Chat } from '../models/index.js';

const createChat = async (req, res) => {
    try {
        const { user_one, user_two } = req.body;
        const response = await Chat.create({
            user_one,
            user_two,
        });
        res.status(201).json({ message: 'Chat creado exitosamente', data: response, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el chat', data: null, success: false });
    }
};

export const ChatController = { createChat };
