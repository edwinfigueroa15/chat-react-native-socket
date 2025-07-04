import { Chat } from '../models/index.js';

const create = async (req, res) => {
    try {
        const { userOne, userTwo } = req.body;
        const chatExists = await Chat.findOne({
            $or: [
                { userOne: userOne, userTwo: userTwo },
                { userOne: userTwo, userTwo: userOne }
            ]
        });
        if (chatExists) return res.status(200).json({ message: 'Ya existe un chat entre estos dos usuarios', data: null, success: true });

        const response = await Chat.create({ userOne, userTwo });
        res.status(201).json({ message: 'Chat creado exitosamente', data: response, success: true });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el chat', data: null, success: false });
    }
};

const getAllByUser = async (req, res) => {
    try {
        const response = await Chat.find({
            $or: [
                { userOne: req.user._id },
                { userTwo: req.user._id }
            ]
        })
        .sort({ updatedAt: -1 })
        .populate([
            { path: 'userOne', select: { __v: 0, password: 0 }, model: 'User' },
            { path: 'userTwo', select: { __v: 0, password: 0 }, model: 'User' }
        ])
        .select(['-__v']);
        if (!response.length) return res.status(200).json({ message: 'No se encontraron chats', data: null, success: true });

        // TODO: Obtener los mensajes de cada chat

        res.status(201).json({ message: 'Chats encontrados exitosamente', data: response, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los chats', data: null, success: false });
    }
};

const getById = async (req, res) => {
    try {
        const response = await Chat.findOne({ _id: req.params.id })
        .populate([
            { path: 'userOne', select: { __v: 0, password: 0 }, model: 'User' },
            { path: 'userTwo', select: { __v: 0, password: 0 }, model: 'User' }
        ])
        .select(['-__v']);

        if (!response) return res.status(404).json({ message: 'Chat no encontrado', data: null, success: false });
        res.status(200).json({ message: 'Chat encontrado exitosamente', data: response, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el chat', data: null, success: false });
    }
};

const remove = async (req, res) => {
    try {
        const response = await Chat.findOneAndDelete({ _id: req.params.id }).select(['-__v']);
        if (!response) return res.status(404).json({ message: 'Chat no encontrado', data: null, success: false });
        res.status(200).json({ message: 'Chat eliminado exitosamente', data: response, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el chat', data: null, success: false });
    }
};

export const ChatController = { create, getAllByUser, getById, remove };
