import { Router } from 'express';
import UserController from '../controllers/user.controller.js';
import authenticateToken from '../middlewares/auth.js';

const router = Router();


//Rutas funcionales
router.get('/users', authenticateToken, UserController.getAllUsers); //1
router.post('/users', UserController.createUser);//2
router.delete('/users/:friendly_code', authenticateToken, UserController.deleteUser); //3 
router.get('/users/:friendly_code', authenticateToken, UserController.getUserByFriendlyCode);//4
router.put('/users/:friendly_code', authenticateToken, UserController.updateUser); //4
router.put('/users/:friendly_code/change-password', authenticateToken, UserController.changePassword);
router.get('/users-names/search', authenticateToken, UserController.getAssignableUsers); //!No diagrama










export default router;
