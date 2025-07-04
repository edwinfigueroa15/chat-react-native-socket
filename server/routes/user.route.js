import express from 'express';
import { UserController } from '../controllers/index.js';
import { isAuthenticated } from '../middlewares/index.js';
import { multerConfig } from '../config/index.js';

const router = express.Router();

router.get('/getMe', [isAuthenticated], UserController.getMe);
router.patch('/updateMe', [isAuthenticated], multerConfig.single('avatar'), UserController.updateMe);
router.get('/getAll', [isAuthenticated], UserController.getAll);
router.get('/getById/:id', [isAuthenticated], UserController.getById);

export default router;