import { Router } from 'express';
import RoleController from '../controllers/role.controller.js';
import authenticateToken from '../middlewares/auth.js';

const router = Router();
//ruta en uso
router.get('/roles', RoleController.getAllRoles);

export default router;
