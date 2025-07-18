import { Group, User } from '../models/index.js';
import fs from 'fs';

const create = async (req, res) => {
    try {
        const { name, users } = req.body;
        const body = {
            name,
            users: users && users.length > 0 ? [req.user._id, ...JSON.parse(users)] : [req.user._id],
            creator: req.user._id,
        }
        if (req.file?.path) body.image = req.file.path;

        const response = await Group.create(body);
        res.status(201).json({ message: 'Grupo creado exitosamente', data: response, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el grupo', data: null, success: false });
    }
}

const getAll = async (req, res) => {
    try {
        const response = await Group.find({ users: { $in: req.user._id } })
        .populate([
            { path: 'users', select: { __v: 0, password: 0 }, model: 'User' },
            { path: 'creator', select: { __v: 0, password: 0 }, model: 'User' },
        ])
        .select(['-__v']);
        if (!response.length) return res.status(200).json({ message: 'No se encontraron grupos del usuario', data: null, success: true });
        res.status(200).json({ message: 'Grupos encontrados exitosamente', data: response, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los grupos del usuario', data: null, success: false });
    }
}

const getById = async (req, res) => {
    try {
        const response = await Group.findOne({ _id: req.params.id })
        .populate([
            { path: 'users', select: { __v: 0, password: 0 }, model: 'User' },
            { path: 'creator', select: { __v: 0, password: 0 }, model: 'User' },
        ])
        .select(['-__v']);
        if (!response) return res.status(200).json({ message: 'No se encontro el grupo del usuario', data: null, success: true });
        res.status(200).json({ message: 'Grupo encontrado exitosamente', data: response, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el grupo del usuario', data: null, success: false });
    }
}

const update = async (req, res) => {
    try {
        const { name, users } = req.body;
        const body = {
            name,
            users: users && users.length > 0 ? [req.user._id, ...JSON.parse(users)] : [req.user._id],
        }

        if (req.file) {
            const currentGroup = await Group.findOne({ _id: req.params.id }).select(['image']);
            if (currentGroup?.image) {
                try {
                    fs.unlinkSync(currentGroup.image);
                } catch (error) {
                    console.error('Error al eliminar imagen anterior:', error);
                }
            }
            body.image = req.file.path;
        }

        const response = await Group.findOneAndUpdate({ _id: req.params.id }, body, { new: true });
        if (!response) return res.status(404).json({ message: 'Grupo no encontrado', data: null, success: false });
        res.status(200).json({ message: 'Grupo actualizado exitosamente', data: response, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el grupo', data: null, success: false });
    }
}

const getUsersNotInGroup = async (req, res) => {
    try {
        const group = await Group.findOne({ _id: req.params.id }).select('users');
        if (!group) return res.status(200).json({ message: 'No se encontro el grupo del usuario', data: null, success: true });

        const users = group.users;
        const response = await User.find({ _id: { $nin: users } }).select(['-password', '-__v']).sort({ createdAt: -1 })
        res.status(200).json({ message: 'Usuarios encontrados exitosamente', data: response, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los usuarios no en el grupo', data: null, success: false });
    }
}

const addUsers = async (req, res) => {
    try {
        const { users } = req.body;
        const response = await Group.findOneAndUpdate({ _id: req.params.id }, { $addToSet: { users: { $each: users } } }, { new: true });
        if (!response) return res.status(404).json({ message: 'Grupo no encontrado', data: null, success: false });
        res.status(200).json({ message: 'Usuarios agregados exitosamente', data: response, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al agregar usuarios al grupo', data: null, success: false });
    }
}

const removeUsers = async (req, res) => {
    try {
        const { users } = req.body;
        const response = await Group.findOneAndUpdate({ _id: req.params.id }, { $pull: { users: { $in: users } } }, { new: true });
        if (!response) return res.status(404).json({ message: 'Grupo no encontrado', data: null, success: false });
        res.status(200).json({ message: 'Usuarios eliminados exitosamente', data: response, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar usuarios del grupo', data: null, success: false });
    }
}

const exitGroup = async (req, res) => {
    try {
        const response = await Group.findOneAndUpdate({ _id: req.params.id }, { $pull: { users: req.user._id } }, { new: true });
        if (!response) return res.status(404).json({ message: 'Grupo no encontrado', data: null, success: false });
        res.status(200).json({ message: 'Usuario abandono el grupo exitosamente', data: response, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al abandonar el grupo', data: null, success: false });
    }
}

const remove = async (req, res) => {
    try {
        const response = await Group.findOneAndDelete({ _id: req.params.id });
        if (!response) return res.status(404).json({ message: 'Grupo no encontrado', data: null, success: false });
        res.status(200).json({ message: 'Grupo eliminado exitosamente', data: response, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el grupo', data: null, success: false });
    }
}

export const GroupController = { create, getAll, getById, update, getUsersNotInGroup, addUsers, removeUsers, exitGroup, remove };
