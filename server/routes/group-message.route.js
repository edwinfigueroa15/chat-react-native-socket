import express from 'express';
import { GroupMessageController } from '../controllers/index.js';
import { isAuthenticated, setUploadPath } from '../middlewares/index.js';
import { multerConfig } from '../config/index.js';

/**
 * @swagger
 * tags:
 *   name: Group Messages
 *   description: Gestión de mensajes de grupo
 */

const router = express.Router();

/**
 * @swagger
 * /api/group-message/send:
 *   post:
 *     summary: Envía un mensaje de texto a un grupo
 *     tags: [Group Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [groupId, content]
 *             properties:
 *               groupId:
 *                 type: string
 *                 description: ID del grupo
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
router.post('/send', [isAuthenticated], GroupMessageController.send);

/**
 * @swagger
 * /api/group-message/sendImage:
 *   post:
 *     summary: Envía un mensaje con imagen a un grupo
 *     tags: [Group Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [groupId, image]
 *             properties:
 *               groupId:
 *                 type: string
 *                 description: ID del grupo
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
router.post('/sendImage', [isAuthenticated, setUploadPath('uploads/group/images')], multerConfig.single('image'), GroupMessageController.sendImage);

/**
 * @swagger
 * /api/group-message/getAllByChat/{id}:
 *   get:
 *     summary: Obtiene todos los mensajes de un grupo
 *     tags: [Group Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del grupo
 *     responses:
 *       200:
 *         description: Lista de mensajes del grupo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Grupo no encontrado
 */
router.get('/getAllByChat/:id', [isAuthenticated], GroupMessageController.getAllByChat);

/**
 * @swagger
 * /api/group-message/getTotalMessagesByChat/{id}:
 *   get:
 *     summary: Obtiene el total de mensajes de un grupo
 *     tags: [Group Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del grupo
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
router.get('/getTotalMessagesByChat/:id', [isAuthenticated], GroupMessageController.getTotalMessagesByChat);

/**
 * @swagger
 * /api/group-message/getLastMessageByChat/{id}:
 *   get:
 *     summary: Obtiene el último mensaje de un grupo
 *     tags: [Group Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del grupo
 *     responses:
 *       200:
 *         description: Último mensaje del grupo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       204:
 *         description: No hay mensajes en el grupo
 *       401:
 *         description: No autorizado
 */
router.get('/getLastMessageByChat/:id', [isAuthenticated], GroupMessageController.getLastMessageByChat);

export default router;