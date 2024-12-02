import CommentModel from '../models/comment.model.js';
import ticketModel from '../models/ticket.model.js';
import notificationService from './notification.service.js';

class CommentService {
    async createComment(commentData) {

        const { friendly_code, user_id } = commentData;
        try {
            const ticketdetails = await ticketModel.getTicketDetailsByFriendlyCode(friendly_code);

            if (!ticketdetails) {
                throw new Error('El ticket no existe');

            }

            const { created_by, assigned_user_id } = ticketdetails;

            const comment = await CommentModel.createComment(commentData);

           const recipients = [];
            if (user_id === assigned_user_id && created_by && user_id !== created_by) {
                // Caso 1: Notificar solo al creador del ticket
                recipients.push(created_by);
            } else if (user_id === created_by && assigned_user_id && user_id !== assigned_user_id) {
                // Caso 2: Notificar solo al usuario asignado
                recipients.push(assigned_user_id);
            } else if (user_id !== created_by || user_id !== assigned_user_id) {
                // Caso 3: Notificar a ambos si existen y no son el mismo usuario que comenta
                if (created_by && user_id !== created_by) {
                    recipients.push(created_by);
                }
                if (assigned_user_id && user_id !== assigned_user_id) {
                    recipients.push(assigned_user_id);
                }
            }

            // Crear notificación si hay destinatarios válidos
            if (recipients.length > 0) {
                await notificationService.createNotification({
                    ticket_id: friendly_code,
                    type: 'Actualización',
                    message: `Has recibido un mensaje en el ticket: ${friendly_code}`,
                    recipients, // IDs de los destinatarios
                });
            } else {
            }
            return comment;
        } catch (error) {
            console.error('Error al crear el comentario en el servicio:', error.message); // Log del mensaje de error
            console.error('Detalles completos del error:', error); // Log para ver más detalles del error

            throw new Error('Error al crear el comentario: ' + error.message);
        }
    }


    async getComments(friendly_code) {
        try {
            const comments = await CommentModel.getCommentsByFriendlyCode(friendly_code);

            // Crear un mapa de comentarios por ID
            const commentMap = {};
            comments.forEach((comment) => {
                comment.replies = []; // Inicializar el array de respuestas
                commentMap[comment.id] = comment;
            });

            // Construir la jerarquía de comentarios
            const roots = [];
            comments.forEach((comment) => {
                if (comment.parent_comment_id === null) {
                    roots.push(comment);
                } else {
                    const parent = commentMap[comment.parent_comment_id];
                    if (parent) {
                        parent.replies.push(comment);
                    }
                }
            });
            return roots; // Asegúrate de enviar los datos estructurados
        } catch (error) {
            console.error('Error al obtener los comentarios:', error);
            throw new Error('Error al obtener los comentarios: ' + error.message);
        }
    }

    async deleteComment(commentId) {
        try {
            // Verificar si el comentario existe antes de eliminarlo
            const existingComment = await CommentModel.getCommentById(commentId);
            if (!existingComment) {
                throw new Error('El comentario no existe');
            }

            // Eliminar el comentario
            await CommentModel.deleteCommentById(commentId);
        } catch (error) {
            console.error('Error al eliminar el comentario:', error);
            throw new Error('No se pudo eliminar el comentario: ' + error.message);
        }
    }





    async getCommentById(commentId) {
        try {
            const comment = await CommentModel.getCommentById(commentId);
            return comment;
        } catch (error) {
            throw new Error('Error al obtener el comentario por ID: ' + error.message);
        }
    }
}

export default new CommentService();
