import express from 'express';
import { UserController } from '../controllers/index.js';
import { isAuthenticated } from '../middlewares/index.js';

const router = express.Router();

router.get('/getMe', [isAuthenticated], UserController.getMe);
router.patch('/updateMe', [isAuthenticated], UserController.updateMe);
router.get('/getAll', [isAuthenticated], UserController.getAll);
router.get('/getById/:id', [isAuthenticated], UserController.getById);

export default router;