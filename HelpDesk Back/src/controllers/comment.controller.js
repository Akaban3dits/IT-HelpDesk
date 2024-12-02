import CommentService from '../services/comment.service.js';
import TicketService from '../services/ticket.service.js';

class CommentController {
    async createComment(req, res, next) {
        try {


            const { comment_text, parent_comment_id } = req.body;
            const { friendly_code } = req.params;
            const user_id = req.user.id;

            // Buscar `ticket_id` mediante `friendly_code`
            const ticket = await TicketService.getTicketByFriendlyCode(friendly_code);
            if (!ticket) {
                console.error('Ticket no encontrado con friendly_code:', friendly_code); // Log para error de ticket no encontrado
                return res.status(404).json({ error: 'Ticket no encontrado' });
            }

            // Validar comentario principal o subcomentario
            if (parent_comment_id) {

                const parentComment = await CommentService.getCommentById(parent_comment_id);
                if (!parentComment) {
                    console.error('Comentario padre no encontrado con ID:', parent_comment_id); // Log para error de comentario padre no encontrado
                    return res.status(404).json({ error: 'Comentario padre no encontrado' });
                }

                if (parentComment.ticket_id !== ticket.friendly_code) {
                    console.error('El comentario padre no pertenece al ticket actual:', parentComment.ticket_id); // Log de error de validación de ticket
                    return res.status(400).json({ error: 'El comentario padre no pertenece a este ticket' });
                }
            }

            const commentData = {
                comment_text,
                friendly_code: ticket.friendly_code,
                user_id,
                parent_comment_id: parent_comment_id || null,
            };

            const newComment = await CommentService.createComment(commentData);

            res.status(201).json(newComment);
        } catch (error) {
            console.error('Error al crear comentario:', error.message); // Log para mostrar el mensaje del error
            console.error('Detalles completos del error:', error); // Log para detalles adicionales del error
            next(error);
        }
    }

    async getComments(req, res, next) {
        try {
            const { friendly_code } = req.params;
            const comments = await CommentService.getComments(friendly_code);
            res.status(200).json(comments);
        } catch (error) {
            console.error('Error al obtener comentarios:', error);
            next(error);
        }
    }

    async deleteComment(req, res, next) {
        try {
            const { id } = req.params;
    
            // Llamar al servicio para eliminar el comentario
            await CommentService.deleteComment(id);
    
            res.status(200).json({ message: 'Comentario eliminado exitosamente' });
        } catch (error) {
            console.error('Error al eliminar el comentario:', error);
            next(error);
        }
    }
    

}

export default new CommentController();
