import express from 'express';
import { ChatMessageController } from '../controllers/index.js';
import { isAuthenticated, setUploadPath } from '../middlewares/index.js';
import { multerConfig } from '../config/index.js';

const router = express.Router();

router.post('/send', [isAuthenticated], ChatMessageController.send);
router.post('/sendImage', [isAuthenticated, setUploadPath('uploads/chat/images')], multerConfig.single('image'), ChatMessageController.sendImage);
router.get('/getAllByChat/:id', [isAuthenticated], ChatMessageController.getAllByChat);
router.get('/getTotalMessagesByChat/:id', [isAuthenticated], ChatMessageController.getTotalMessagesByChat);
router.get('/getLastMessageByChat/:id', [isAuthenticated], ChatMessageController.getLastMessageByChat);

export default router;