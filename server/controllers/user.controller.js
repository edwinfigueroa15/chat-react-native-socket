import { User } from '../models/index.js';
import { multerConfig } from '../config/index.js';
import fs from 'fs';

const getMe = async (req, res) => {
    try {
        const response = await User.findOne({ _id: req.user._id }).select(['-password']);
        if (!response) return res.status(404).json({ message: 'Usuario no encontrado', data: null, success: false });
        res.status(200).json({ message: 'Usuario encontrado exitosamente', data: response, success: true });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el usuario', data: null, success: false });
    }
}

const updateMe = async (req, res) => {
    try {
        const body = { ...req.body };
        // Validar si el archivo llego y eliminar el avatar anterior
        if (req.file) {
            const currentUser = await User.findOne({ _id: req.user._id }).select(['avatar']);
            if (currentUser?.avatar) {
                try {
                    fs.unlinkSync(currentUser.avatar);
                } catch (error) {
                    console.error('Error al eliminar avatar anterior:', error);
                }
            }
            body.avatar = req.file.path;
        }

        const response = await User.findOneAndUpdate(
            { _id: req.user._id },
            body,
            { new: true, runValidators: true, context: 'query' }
        ).select(['-password']);

        if (!response) return res.status(404).json({ message: 'Usuario no encontrado', data: null, success: false });
        res.status(200).json({ message: 'Usuario actualizado exitosamente', data: response, success: true });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el usuario', data: null, success: false });
    }
}

const getAll = async (req, res) => {
    try {
        const response = await User.find({ _id: { $ne: req.user._id } }).select(['-password']);
        if (!response.length) return res.status(404).json({ message: 'No se encontraron usuarios', data: null, success: false });
        res.status(200).json({ message: 'Usuarios encontrados exitosamente', data: response, success: true });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los usuarios', data: null, success: false });
    }
}

const getById = async (req, res) => {
    try {
        const response = await User.findOne({ _id: req.params.id }).select(['-password']);
        if (!response) return res.status(404).json({ message: 'Usuario no encontrado', data: null, success: false });
        res.status(200).json({ message: 'Usuario encontrado exitosamente', data: response, success: true });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el usuario', data: null, success: false });
    }
}

export const UserController = { getMe, updateMe, getAll, getById };
