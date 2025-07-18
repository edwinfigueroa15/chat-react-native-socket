
import express from 'express';
import { GroupController } from '../controllers/index.js';
import { isAuthenticated, setUploadPath } from '../middlewares/index.js';
import { multerConfig } from '../config/index.js';

/**
 * @swagger
 * tags:
 *   name: Group
 *   description: Gestión de grupos de chat
 */

const router = express.Router();

/**
 * @swagger
 * /api/group/create:
 *   post:
 *     summary: Crea un nuevo grupo
 *     tags: [Group]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [users]
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del grupo
 *               users:
 *                 type: string
 *                 description: JSON string de un array de IDs de usuarios
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Imagen del grupo (opcional)
 *     responses:
 *       201:
 *         description: Grupo creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       500:
 *         description: Error al crear el grupo
 */
router.post('/create', [isAuthenticated], setUploadPath('uploads/groups/images'), multerConfig.single('image'), GroupController.create);

/**
 * @swagger
 * /api/group/getAll:
 *   get:
 *     summary: Obtiene todos los grupos del usuario autenticado
 *     tags: [Group]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de grupos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Group'
 *       500:
 *         description: Error al obtener los grupos
 */
router.get('/getAll', [isAuthenticated], GroupController.getAll);

/**
 * @swagger
 * /api/group/getById/{id}:
 *   get:
 *     summary: Obtiene un grupo por ID
 *     tags: [Group]
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
 *         description: Grupo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Group'
 *       404:
 *         description: Grupo no encontrado
 */
router.get('/getById/:id', [isAuthenticated], GroupController.getById);

/**
 * @swagger
 * /api/group/update/{id}:
 *   patch:
 *     summary: Actualiza un grupo
 *     tags: [Group]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del grupo a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nuevo nombre del grupo
 *               users:
 *                 type: string
 *                 description: JSON string de un array de IDs de usuarios
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Nueva imagen del grupo (opcional)
 *     responses:
 *       200:
 *         description: Grupo actualizado exitosamente
 *       404:
 *         description: Grupo no encontrado
 *       500:
 *         description: Error al actualizar el grupo
 */
router.patch('/update/:id', [isAuthenticated], setUploadPath('uploads/groups/images'), multerConfig.single('image'), GroupController.update);

/**
 * @swagger
 * /api/group/exitGroup/{id}:
 *   patch:
 *     summary: El usuario actual abandona el grupo
 *     tags: [Group]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del grupo a abandonar
 *     responses:
 *       200:
 *         description: Usuario abandonó el grupo exitosamente
 *       404:
 *         description: Grupo no encontrado
 *       500:
 *         description: Error al abandonar el grupo
 */
router.patch('/exitGroup/:id', [isAuthenticated], GroupController.exitGroup);

/**
 * @swagger
 * /api/group/getUsersNotInGroup/{id}:
 *   get:
 *     summary: Obtiene usuarios que no están en el grupo
 *     tags: [Group]
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
 *         description: Lista de usuarios que no están en el grupo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Error al obtener los usuarios
 */
router.get('/getUsersNotInGroup/:id', [isAuthenticated], GroupController.getUsersNotInGroup);

/**
 * @swagger
 * /api/group/addUsers/{id}:
 *   patch:
 *     summary: Agrega usuarios a un grupo
 *     tags: [Group]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del grupo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - users
 *             properties:
 *               users:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array de IDs de usuarios a agregar
 *     responses:
 *       200:
 *         description: Usuarios agregados exitosamente
 *       404:
 *         description: Grupo no encontrado
 *       500:
 *         description: Error al agregar usuarios al grupo
 */
router.patch('/addUsers/:id', [isAuthenticated], GroupController.addUsers);

/**
 * @swagger
 * /api/group/removeUsers/{id}:
 *   patch:
 *     summary: Elimina usuarios de un grupo
 *     tags: [Group]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del grupo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - users
 *             properties:
 *               users:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array de IDs de usuarios a eliminar
 *     responses:
 *       200:
 *         description: Usuarios eliminados exitosamente
 *       404:
 *         description: Grupo no encontrado
 *       500:
 *         description: Error al eliminar usuarios del grupo
 */
router.patch('/removeUsers/:id', [isAuthenticated], GroupController.removeUsers);

/**
 * @swagger
 * /api/group/delete/{id}:
 *   delete:
 *     summary: Elimina un grupo
 *     tags: [Group]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del grupo a eliminar
 *     responses:
 *       200:
 *         description: Grupo eliminado exitosamente
 *       404:
 *         description: Grupo no encontrado
 *       500:
 *         description: Error al eliminar el grupo
 */
router.delete('/delete/:id', [isAuthenticated], GroupController.remove);

export default router;