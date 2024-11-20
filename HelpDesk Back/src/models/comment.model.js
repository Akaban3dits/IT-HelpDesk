import pool from '../config/db.js';

class Comment {
    async createComment(commentData) {
        const { comment_text, ticket_id, user_id, parent_comment_id } = commentData;
        const result = await db.query(
            `INSERT INTO comments (comment_text, ticket_id, user_id, parent_comment_id, created_at)
             VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,
            [comment_text, ticket_id, user_id, parent_comment_id]
        );
        return result.rows[0];
    }

    async getCommentsByFriendlyCode(friendly_code) {
        // Obtener el `ticket_id` mediante `friendly_code`
        const ticket = await TicketModel.getTicketByFriendlyCode(friendly_code);
        if (!ticket) throw new Error('Ticket no encontrado');

        const result = await db.query(
            `SELECT * FROM comments WHERE ticket_id = $1 ORDER BY created_at ASC`,
            [ticket.id]
        );
        return result.rows;
    }
}

export default new Comment();
