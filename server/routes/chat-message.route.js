import express from 'express';
import { ChatMessageController } from '../controllers/index.js';
import { isAuthenticated, setUploadPath } from '../middlewares/index.js';
import { multerConfig } from '../config/index.js';

/**
 * @swagger
 * tags:
 *   name: Chat Messages
 *   description: Gestión de mensajes de chat
 */

const router = express.Router();

/**
 * @swagger
 * /api/chat-message/send:
 *   post:
 *     summary: Envía un mensaje de texto
 *     tags: [Chat Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [chatId, content]
 *             properties:
 *               chatId:
 *                 type: string
 *                 description: ID del chat/grupo
 *               content:
 *                 type: string
 *                 description: Contenido del mensaje
 *     responses:
 *       201:
 *         description: Mensaje enviado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 */
router.post('/send', [isAuthenticated], ChatMessageController.send);

/**
 * @swagger
 * /api/chat-message/sendImage:
 *   post:
 *     summary: Envía un mensaje con imagen
 *     tags: [Chat Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [chatId, image]
 *             properties:
 *               chatId:
 *                 type: string
 *                 description: ID del chat/grupo
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Imagen a enviar
 *     responses:
 *       201:
 *         description: Imagen enviada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       400:
 *         description: Error de validación o archivo no proporcionado
 *       401:
 *         description: No autorizado
 */
router.post('/sendImage', [isAuthenticated, setUploadPath('uploads/chat/images')], multerConfig.single('image'), ChatMessageController.sendImage);

/**
 * @swagger
 * /api/chat-message/getAllByChat/{id}:
 *   get:
 *     summary: Obtiene todos los mensajes de un chat
 *     tags: [Chat Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del chat/grupo
 *     responses:
 *       200:
 *         description: Lista de mensajes del chat
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Chat no encontrado
 */
router.get('/getAllByChat/:id', [isAuthenticated], ChatMessageController.getAllByChat);

/**
 * @swagger
 * /api/chat-message/getTotalMessagesByChat/{id}:
 *   get:
 *     summary: Obtiene el total de mensajes de un chat
 *     tags: [Chat Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del chat/grupo
 *     responses:
 *       200:
 *         description: Total de mensajes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Número total de mensajes
 *       401:
 *         description: No autorizado
 */
router.get('/getTotalMessagesByChat/:id', [isAuthenticated], ChatMessageController.getTotalMessagesByChat);

/**
 * @swagger
 * /api/chat-message/getLastMessageByChat/{id}:
 *   get:
 *     summary: Obtiene el último mensaje de un chat
 *     tags: [Chat Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del chat/grupo
 *     responses:
 *       200:
 *         description: Último mensaje del chat
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       204:
 *         description: No hay mensajes en el chat
 *       401:
 *         description: No autorizado
 */
router.get('/getLastMessageByChat/:id', [isAuthenticated], ChatMessageController.getLastMessageByChat);

export default router;