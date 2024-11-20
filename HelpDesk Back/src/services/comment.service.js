import CommentModel from '../models/comment.model.js';

class CommentService {
    async createComment(commentData) {
        try {
            const comment = await CommentModel.createComment(commentData);
            return comment;
        } catch (error) {
            throw new Error('Error al crear el comentario: ' + error)
        }
    }

    async getComments(friendly_code) {
        try {
            const comments = await CommentModel.getCommentsByFriendlyCode(friendly_code);
            return comments;
        } catch (error) {
            throw new Error('Error al crear el comentario: ' + error)
        }
    }
}

export default new CommentService();
