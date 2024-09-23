import pool from '../config/db.js';

class NotificationUser {
    async findById(notification_id, user_id) {
        const result = await pool.query(
            'SELECT * FROM notification_user WHERE notification_id = $1 AND user_id = $2', 
            [notification_id, user_id]
        );
        return result.rows[0];
    }

    async findAllByUser(user_id) {
        const result = await pool.query(
            'SELECT * FROM notification_user WHERE user_id = $1 ORDER BY read_at ASC', 
            [user_id]
        );
        return result.rows;
    }

    async create({ notification_id, user_id, read_at }) {
        const result = await pool.query(
            `INSERT INTO notification_user (notification_id, user_id, read_at)
             VALUES ($1, $2, $3) RETURNING *`,
            [notification_id, user_id, read_at]
        );
        return result.rows[0];
    }

    async update(notification_id, user_id, { read_at }) {
        const result = await pool.query(
            `UPDATE notification_user SET 
                read_at = $1
            WHERE 
                notification_id = $2 AND user_id = $3 RETURNING *`,
            [read_at, notification_id, user_id]
        );
        return result.rows[0];
    }

    async delete(notification_id, user_id) {
        const result = await pool.query(
            'DELETE FROM notification_user WHERE notification_id = $1 AND user_id = $2 RETURNING *', 
            [notification_id, user_id]
        );
        return result.rows[0];
    }
}

export default new NotificationUser();
