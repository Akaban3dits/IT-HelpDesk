import CommentModel from '../models/comment.model.js';

class CommentService {
    async createComment(commentData) {
        return await CommentModel.create(commentData);
    }

    async getAllComments() {
        return await CommentModel.findAllByTicket();
    }

    async getCommentById(commentId) {
        return await CommentModel.findById(commentId);
    }

    async updateComment(commentId, commentData) {
        return await CommentModel.update(commentId, commentData);
    }

    async deleteComment(commentId) {
        return await CommentModel.delete(commentId);
    }
}

export default new CommentService();
