import { GroupMessage } from '../models/index.js';
import { socketServer } from '../config/index.js';

const send = async (req, res) => {
    try {
        const { groupId, message } = req.body;
        const { _id } = req.user;

        const groupMessage = await GroupMessage.create({ group: groupId, message, user: _id, type: 'text', read: false });
        const response = await groupMessage.populate([
            { path: 'user', select: { __v: 0, password: 0 }, model: 'User' },
        ]);

        const responseWithoutChat = { ...response._doc };
        delete responseWithoutChat.group;
        delete responseWithoutChat.__v;

        socketServer.io.sockets.in(groupId).emit('message', responseWithoutChat);
        socketServer.io.sockets.in(`${groupId}_notify`).emit('message_notify', responseWithoutChat);
        res.status(200).json({ message: 'Group message creado exitosamente', data: responseWithoutChat, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el group message', data: null, success: false });
    }
};

const sendImage = async (req, res) => {
    try {
        const { groupId } = req.body;
        const { _id } = req.user;

        const groupMessage = await GroupMessage.create({ group: groupId, message: req.file.path, user: _id, type: 'image', read: false });
        const response = await groupMessage.populate([
            { path: 'user', select: { __v: 0, password: 0 }, model: 'User' },
        ]);

        const responseWithoutChat = { ...response._doc };
        delete responseWithoutChat.group;
        delete responseWithoutChat.__v;

        socketServer.io.sockets.in(groupId).emit('message', responseWithoutChat);
        socketServer.io.sockets.in(`${groupId}_notify`).emit('message_notify', responseWithoutChat);
        res.status(200).json({ message: 'Group message creado exitosamente', data: responseWithoutChat, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el group message', data: null, success: false });
    }
};

const getAllByChat = async (req, res) => {
    try {
        const count = await GroupMessage.countDocuments({ group: req.params.id })
        const response = await GroupMessage.find({ group: req.params.id })
            .populate([
                { path: 'user', select: { __v: 0, password: 0 }, model: 'User' },
            ])
            .select(['-__v', '-group'])
            .sort({ createdAt: -1 });

        if (!response.length) return res.status(200).json({ message: 'No se encontraron group messages', data: null, success: true });
        res.status(200).json({ message: 'Group messages encontrados exitosamente', data: { count, chats: response }, success: true });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los group messages', data: null, success: false });
    }
};

const getTotalMessagesByChat = async (req, res) => {
    try {
        const count = await GroupMessage.countDocuments({ group: req.params.id })
        if (!count) return res.status(200).json({ message: 'No se encontraron group messages', data: count, success: true });
        res.status(200).json({ message: 'Group messages encontrados exitosamente', data: count, success: true });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los group messages', data: null, success: false });
    }
};

const getLastMessageByChat = async (req, res) => {
    try {
        const response = await GroupMessage.findOne({ group: req.params.id })
            .populate([
                { path: 'user', select: { __v: 0, password: 0 }, model: 'User' },
            ])
            .select(['-__v', '-group'])
            .sort({ createdAt: -1 });

        if (!response) return res.status(200).json({ message: 'No se encontraron group messages', data: null, success: true });
        res.status(200).json({ message: 'Group message encontrado exitosamente', data: response, success: true });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el group message', data: null, success: false });
    }
};

export const GroupMessageController = { send, sendImage, getAllByChat, getTotalMessagesByChat, getLastMessageByChat };
