import pool from '../config/db.js';

class Comment {
    async findById(comment_id) {
        const result = await pool.query('SELECT * FROM comments WHERE comment_id = $1', [comment_id]);
        return result.rows[0];
    }

    async findAllByTicket(ticket_id) {
        const result = await pool.query('SELECT * FROM comments WHERE ticket_id = $1 ORDER BY created_at ASC', [ticket_id]);
        return result.rows;
    }

    async create({ comment_text, created_at, ticket_id, user_id, parent_comment_id }) {
        const result = await pool.query(
            `INSERT INTO comments (comment_text, created_at, ticket_id, user_id, parent_comment_id)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [comment_text, created_at, ticket_id, user_id, parent_comment_id]
        );
        return result.rows[0];
    }

    async update(comment_id, { comment_text, created_at, ticket_id, user_id, parent_comment_id }) {
        const result = await pool.query(
            `UPDATE comments SET 
                comment_text = $1,
                created_at = $2,
                ticket_id = $3,
                user_id = $4,
                parent_comment_id = $5
            WHERE 
                comment_id = $6 RETURNING *`,
            [comment_text, created_at, ticket_id, user_id, parent_comment_id, comment_id]
        );
        return result.rows[0];
    }

    async delete(comment_id) {
        const result = await pool.query('DELETE FROM comments WHERE comment_id = $1 RETURNING *', [comment_id]);
        return result.rows[0];
    }
}

export default new Comment();
