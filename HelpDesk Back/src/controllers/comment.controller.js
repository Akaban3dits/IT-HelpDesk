import CommentService from '../services/comment.service.js';

class CommentController {
    async createComment(req, res, next) {
        try {
            const { comment_text, parent_comment_id } = req.body;
            const { friendly_code } = req.params;
            const user_id = req.user.id; // Suponiendo que el `user_id` viene del token de autenticación

            // Buscar `ticket_id` mediante `friendly_code`
            const ticket = await TicketService.getTicketByFriendlyCode(friendly_code);
            if (!ticket) return res.status(404).json({ error: 'Ticket no encontrado' });

            const commentData = {
                comment_text,
                ticket_id: ticket.id,
                user_id,
                parent_comment_id: parent_comment_id || null
            };

            const newComment = await CommentService.createComment(commentData);
            res.status(201).json(newComment);
        } catch (error) {
            console.error('Error al crear comentario:', error);
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
}

export default new CommentController();
