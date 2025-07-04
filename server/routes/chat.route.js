import express from 'express';
import { ChatController } from '../controllers/index.js';
import { isAuthenticated } from '../middlewares/index.js';

const router = express.Router();

router.post('/create', [isAuthenticated], ChatController.create);
router.get('/allByUser', [isAuthenticated], ChatController.getAllByUser);
router.get('/getById/:id', [isAuthenticated], ChatController.getById);
router.delete('/delete/:id', [isAuthenticated], ChatController.remove);

export default router;