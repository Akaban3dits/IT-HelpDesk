import CommentModel from '../models/comment.model.js';

class CommentService {
    async createComment(commentData) {
        try {
            
            const comment = await CommentModel.createComment(commentData);
            
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
    
            console.log('Comentarios raíz con sus respuestas antes de enviar:', JSON.stringify(roots, null, 2));
            return roots; // Asegúrate de enviar los datos estructurados
        } catch (error) {
            console.error('Error al obtener los comentarios:', error);
            throw new Error('Error al obtener los comentarios: ' + error.message);
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
