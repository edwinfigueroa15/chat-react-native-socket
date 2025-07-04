import express from 'express';
import { ChatController } from '../controllers/index.js';
import { isAuthenticated } from '../middlewares/index.js';

const router = express.Router();

router.post('/createChat', [isAuthenticated], ChatController.createChat);

export default router;