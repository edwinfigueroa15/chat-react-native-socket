import bcryptjs from 'bcryptjs';
import { User } from '../models/index.js';
import { JwtUtil } from '../utils/index.js';

const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const response = await User.create({
            email,
            password: bcryptjs.hashSync(password, bcryptjs.genSaltSync(10)),
        });
        res.status(201).json({ message: 'Usuario registrado exitosamente', data: response, success: true });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al registrar el usuario', data: null, success: false });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado', data: null, success: false });

        const isPasswordValid = bcryptjs.compareSync(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Contraseña incorrecta', data: null, success: false });

        const payload = {
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar,
        }
        const accessToken = JwtUtil.generateToken(payload);
        const refreshToken = JwtUtil.generateToken(payload, '30d');

        res.status(200).json({ message: 'Inicio de sesión exitoso', data: { accessToken, refreshToken }, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al iniciar sesión', data: null, success: false });
    }
};

const refreshAccessToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const verifyToken = JwtUtil.verifyToken(refreshToken);
        if (!verifyToken) return res.status(401).json({ message: 'Token inválido', data: null, success: false });

        const payload = {
            _id: verifyToken._id,
            email: verifyToken.email,
            firstName: verifyToken.firstName,
            lastName: verifyToken.lastName,
            avatar: verifyToken.avatar,
        }
        const accessToken = JwtUtil.generateToken(payload);

        res.status(200).json({ message: 'Token renovado exitosamente', data: { accessToken, refreshToken }, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al renovar el token', data: null, success: false });
    }
};

export const AuthController = { register, login, refreshAccessToken };
