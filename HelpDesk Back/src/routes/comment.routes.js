import { Router } from 'express';
import CommentController from '../controllers/comment.controller.js';
import authenticateToken from '../middlewares/auth.js';

const router = Router();

router.post('/tickets/:friendly_code/comments', authenticateToken, CommentController.createComment);

// Ruta para obtener comentarios de un ticket específico usando `friendly_code`
router.get('/tickets/:friendly_code/comments', authenticateToken, CommentController.getComments);

// Ruta para eliminar un comentario por su ID
router.delete('/comments/:id', authenticateToken, CommentController.deleteComment);


export default router;


