import { ChatMessage } from '../models/index.js';
import { socketServer } from '../config/index.js';

const send = async (req, res) => {
    try {
        const { chatId, message } = req.body;
        const { _id } = req.user;

        const chatMessage = await ChatMessage.create({ chat: chatId, message, user: _id, type: 'text', read: false });
        const response = await chatMessage.populate([
            { path: 'user', select: { __v: 0, password: 0 }, model: 'User' },
        ]);

        const responseWithoutChat = { ...response._doc };
        delete responseWithoutChat.chat;
        delete responseWithoutChat.__v;

        socketServer.io.sockets.in(chatId).emit('message', responseWithoutChat);
        socketServer.io.sockets.in(`${chatId}_notify`).emit('message_notify', responseWithoutChat);
        res.status(200).json({ message: 'Chat message creado exitosamente', data: responseWithoutChat, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el chat message', data: null, success: false });
    }
};

const sendImage = async (req, res) => {
    try {
        const { chatId } = req.body;
        const { _id } = req.user;

        const chatMessage = await ChatMessage.create({ chat: chatId, message: req.file.path, user: _id, type: 'image', read: false });
        const response = await chatMessage.populate([
            { path: 'user', select: { __v: 0, password: 0 }, model: 'User' },
        ]);

        const responseWithoutChat = { ...response._doc };
        delete responseWithoutChat.chat;
        delete responseWithoutChat.__v;

        socketServer.io.sockets.in(chatId).emit('message', responseWithoutChat);
        socketServer.io.sockets.in(`${chatId}_notify`).emit('message_notify', responseWithoutChat);
        res.status(200).json({ message: 'Chat message creado exitosamente', data: responseWithoutChat, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el chat message', data: null, success: false });
    }
};

const getAllByChat = async (req, res) => {
    try {
        const count = await ChatMessage.countDocuments({ chat: req.params.id })
        const response = await ChatMessage.find({ chat: req.params.id })
            .populate([
                { path: 'user', select: { __v: 0, password: 0 }, model: 'User' },
            ])
            .select(['-__v', '-chat'])
            .sort({ createdAt: -1 });

        if (!response.length) return res.status(200).json({ message: 'No se encontraron chat messages', data: null, success: true });
        res.status(200).json({ message: 'Chat messages encontrados exitosamente', data: { count, chats: response }, success: true });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los chat messages', data: null, success: false });
    }
};

const getTotalMessagesByChat = async (req, res) => {
    try {
        const count = await ChatMessage.countDocuments({ chat: req.params.id })
        if (!count) return res.status(200).json({ message: 'No se encontraron chat messages', data: count, success: true });
        res.status(200).json({ message: 'Chat messages encontrados exitosamente', data: count, success: true });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los chat messages', data: null, success: false });
    }
};

const getLastMessageByChat = async (req, res) => {
    try {
        const response = await ChatMessage.findOne({ chat: req.params.id })
            .populate([
                { path: 'user', select: { __v: 0, password: 0 }, model: 'User' },
            ])
            .select(['-__v', '-chat'])
            .sort({ createdAt: -1 });

        if (!response) return res.status(200).json({ message: 'No se encontraron chat messages', data: null, success: true });
        res.status(200).json({ message: 'Chat message encontrado exitosamente', data: response, success: true });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el chat message', data: null, success: false });
    }
};

export const ChatMessageController = { send, sendImage, getAllByChat, getTotalMessagesByChat, getLastMessageByChat };
