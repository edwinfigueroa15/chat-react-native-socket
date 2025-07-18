import express from 'express';
import { UserController } from '../controllers/index.js';
import { isAuthenticated, setUploadPath } from '../middlewares/index.js';
import { multerConfig } from '../config/index.js';

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestión de usuarios del sistema
 */

const router = express.Router();

/**
 * @swagger
 * /api/user/getMe:
 *   get:
 *     summary: Obtiene la información del usuario autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Información del usuario obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       401:
 *         description: No autorizado
 */
router.get('/getMe', [isAuthenticated], UserController.getMe);

/**
 * @swagger
 * /api/user/updateMe:
 *   patch:
 *     summary: Actualiza la información del usuario autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nuevo nombre de usuario
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Nuevo correo electrónico
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Nueva imagen de perfil (opcional)
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 */
router.patch('/updateMe', [isAuthenticated], setUploadPath('uploads/avatars'), multerConfig.single('avatar'), UserController.updateMe);

/**
 * @swagger
 * /api/user/getAll:
 *   get:
 *     summary: Obtiene todos los usuarios (solo administradores)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permisos de administrador
 */
router.get('/getAll', [isAuthenticated], UserController.getAll);

/**
 * @swagger
 * /api/user/getById/{id}:
 *   get:
 *     summary: Obtiene un usuario por su ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a buscar
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/getById/:id', [isAuthenticated], UserController.getById);

export default router;