import CommentService from '../services/comment.service.js';

class CommentController {
    async createComment(req, res) {
        try {
            const comment = await CommentService.createComment(req.body);
            return res.status(201).json(comment);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getAllComments(req, res) {
        try {
            const comments = await CommentService.getAllComments();
            return res.status(200).json(comments);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getCommentById(req, res) {
        try {
            const comment = await CommentService.getCommentById(req.params.id);
            if (!comment) {
                return res.status(404).json({ message: 'Comment not found' });
            }
            return res.status(200).json(comment);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async updateComment(req, res) {
        try {
            const updatedComment = await CommentService.updateComment(req.params.id, req.body);
            if (!updatedComment) {
                return res.status(404).json({ message: 'Comment not found' });
            }
            return res.status(200).json(updatedComment);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async deleteComment(req, res) {
        try {
            const deletedComment = await CommentService.deleteComment(req.params.id);
            if (!deletedComment) {
                return res.status(404).json({ message: 'Comment not found' });
            }
            return res.status(200).json({ message: 'Comment deleted successfully' });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export default new CommentController();
