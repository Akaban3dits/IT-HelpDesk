import { Router } from 'express';
import PriorityController from '../controllers/priority.controller.js';
import authenticateToken from '../middlewares/auth.js';

const router = Router();
//*Ruta en uso
router.get('/priority', authenticateToken, PriorityController.getAllPriorities);


//!Rutas sin uso
router.get('/priority/:priority_id', authenticateToken, PriorityController.getPriorityById);

router.post('/priority', authenticateToken, PriorityController.createPriority);

router.put('/priority/:priority_id', authenticateToken, PriorityController.updatePriority);

router.delete('/priority/:priority_id', authenticateToken, PriorityController.deletePriority);

export default router;
