import { Router } from 'express';
import PriorityController from '../controllers/priority.controller.js';
import authenticateToken from '../middlewares/auth.js';

const router = Router();
//*Ruta en uso
router.get('/priority', authenticateToken, PriorityController.getAllPriorities);

export default router;
