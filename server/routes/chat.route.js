import express from 'express';
import { ChatController } from '../controllers/index.js';
import { isAuthenticated } from '../middlewares/index.js';

/**
 * @swagger
 * tags:
 *   name: Chats
 *   description: Gestión de chats individuales entre usuarios
 */

const router = express.Router();

/**
 * @swagger
 * /api/chat/create:
 *   post:
 *     summary: Crea un nuevo chat individual
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId]
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID del usuario con el que se inicia el chat
 *     responses:
 *       201:
 *         description: Chat creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chat'
 *       400:
 *         description: Error de validación o chat ya existe
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 */
router.post('/create', [isAuthenticated], ChatController.create);

/**
 * @swagger
 * /api/chat/allByUser:
 *   get:
 *     summary: Obtiene todos los chats del usuario autenticado
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de chats del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Chat'
 *       401:
 *         description: No autorizado
 */
router.get('/allByUser', [isAuthenticated], ChatController.getAllByUser);

/**
 * @swagger
 * /api/chat/getById/{id}:
 *   get:
 *     summary: Obtiene un chat por su ID
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del chat a buscar
 *     responses:
 *       200:
 *         description: Chat encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chat'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permiso para ver este chat
 *       404:
 *         description: Chat no encontrado
 */
router.get('/getById/:id', [isAuthenticated], ChatController.getById);

/**
 * @swagger
 * /api/chat/delete/{id}:
 *   delete:
 *     summary: Elimina un chat
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del chat a eliminar
 *     responses:
 *       200:
 *         description: Chat eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permiso para eliminar este chat
 *       404:
 *         description: Chat no encontrado
 */
router.delete('/delete/:id', [isAuthenticated], ChatController.remove);

export default router;