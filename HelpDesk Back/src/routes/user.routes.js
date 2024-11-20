import { Router } from 'express';
import UserController from '../controllers/user.controller.js';
import authenticateToken from '../middlewares/auth.js';

const router = Router();


//Rutas funcionales
router.get('/users', authenticateToken, UserController.getAllUsers);
router.post('/users', UserController.createUser);
router.delete('/users/:friendly_code', authenticateToken, UserController.deleteUser);
router.get('/users/:friendly_code', authenticateToken, UserController.getUserByFriendlyCode);
router.put('/users/:friendly_code', authenticateToken, UserController.updateUser);
router.put('/users/:friendly_code/change-password', authenticateToken, UserController.changePassword);
router.get('/users-names/search', authenticateToken, UserController.getAssignableUsers);










export default router;
