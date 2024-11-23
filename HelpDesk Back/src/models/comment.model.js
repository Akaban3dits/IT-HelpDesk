import pool from '../config/db.js';

class Comment {
    async createComment(commentData) {
        const { comment_text, ticket_id, user_id, parent_comment_id } = commentData;
        const result = await pool.query(
            `INSERT INTO comments (comment_text, ticket_id, user_id, parent_comment_id, created_at)
             VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,
            [comment_text, ticket_id, user_id, parent_comment_id]
        );
        return result.rows[0];
    }

    async getCommentsByFriendlyCode(friendly_code) {
        const result = await pool.query(
            `SELECT 
                c.id,
                c.comment_text,
                c.created_at,
                c.ticket_id,
                c.parent_comment_id,
                c.user_id,
                u.first_name,
                u.last_name
             FROM comments c
             JOIN users u ON c.user_id = u.friendly_code
             WHERE c.ticket_id = $1
             ORDER BY c.created_at DESC`,
            [friendly_code]
        );
        return result.rows;
    }
    
    
    async getCommentById(commentId) {
        try {
            const result = await pool.query(
                `SELECT * FROM comments WHERE id = $1`,
                [commentId]
            );
            return result.rows[0] || null; // Devuelve el comentario o null si no se encuentra
        } catch (error) {
            throw new Error('Error al obtener el comentario por ID: ' + error.message);
        }
    }
}

export default new Comment();
