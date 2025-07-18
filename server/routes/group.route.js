import express from 'express';
import { GroupController } from '../controllers/index.js';
import { isAuthenticated, setUploadPath } from '../middlewares/index.js';
import { multerConfig } from '../config/index.js';

const router = express.Router();

router.post('/create', [isAuthenticated], setUploadPath('uploads/groups/images'), multerConfig.single('image'), GroupController.create);
router.get('/getAll', [isAuthenticated], GroupController.getAll);
router.get('/getById/:id', [isAuthenticated], GroupController.getById);
router.patch('/update/:id', [isAuthenticated], setUploadPath('uploads/groups/images'), multerConfig.single('image'), GroupController.update);
router.patch('/exitGroup/:id', [isAuthenticated], GroupController.exitGroup);
router.get('/getUsersNotInGroup/:id', [isAuthenticated], GroupController.getUsersNotInGroup);
router.patch('/addUsers/:id', [isAuthenticated], GroupController.addUsers);
router.patch('/removeUsers/:id', [isAuthenticated], GroupController.removeUsers);
router.delete('/delete/:id', [isAuthenticated], GroupController.remove);

export default router;