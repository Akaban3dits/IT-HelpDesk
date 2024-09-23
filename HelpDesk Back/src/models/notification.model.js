import pool from '../config/db.js';

class Notification {
    async findById(notification_id) {
        const result = await pool.query('SELECT * FROM notifications WHERE notification_id = $1', [notification_id]);
        return result.rows[0];
    }

    async findAll() {
        const result = await pool.query('SELECT * FROM notifications');
        return result.rows;
    }

    async create({ message, created_at, ticket_id }) {
        const result = await pool.query(
            `INSERT INTO notifications (message, created_at, ticket_id)
             VALUES ($1, $2, $3) RETURNING *`,
            [message, created_at, ticket_id]
        );
        return result.rows[0];
    }

    async update(notification_id, { message, created_at, ticket_id }) {
        const result = await pool.query(
            `UPDATE notifications SET 
                message = $1,
                created_at = $2,
                ticket_id = $3
            WHERE 
                notification_id = $4 RETURNING *`,
            [message, created_at, ticket_id, notification_id]
        );
        return result.rows[0];
    }

    async delete(notification_id) {
        const result = await pool.query('DELETE FROM notifications WHERE notification_id = $1 RETURNING *', [notification_id]);
        return result.rows[0];
    }
}

export default new Notification();
