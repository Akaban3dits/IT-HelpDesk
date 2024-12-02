import { Router } from 'express';
import TaskController from '../controllers/task.controller.js';
import authenticateToken from '../middlewares/auth.js';

const router = Router();

// Crear una tarea
router.post('/tickets/:ticket_id/tasks', authenticateToken, TaskController.createTask);

// Editar una tarea
router.put('/tasks/:id', authenticateToken, TaskController.updateTask);

// Eliminar una tarea
router.delete('/tasks/:id', authenticateToken, TaskController.deleteTask);

// Ver tareas por ticket_id
router.get('/tickets/:ticket_id/tasks', authenticateToken, TaskController.getTasksByTicketId);



export default router;
