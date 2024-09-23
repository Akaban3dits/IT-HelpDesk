import pool from '../config/db.js';

class StatusHistory {
    async findAll() {
        const result = await pool.query('SELECT * FROM statushistory');
        return result.rows;
    }

    async findById(history_id) {
        const result = await pool.query('SELECT * FROM statushistory WHERE history_id = $1', [history_id]);
        return result.rows[0];
    }

    async create({ changed_at, old_status, new_status, ticket_id, changed_by_user_id }) {
        const result = await pool.query(
            `INSERT INTO statushistory (changed_at, old_status, new_status, ticket_id, changed_by_user_id)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [changed_at, old_status, new_status, ticket_id, changed_by_user_id]
        );
        return result.rows[0];
    }

    async update(history_id, { changed_at, old_status, new_status, ticket_id, changed_by_user_id }) {
        const result = await pool.query(
            `UPDATE statushistory SET 
                changed_at = $1,
                old_status = $2,
                new_status = $3,
                ticket_id = $4,
                changed_by_user_id = $5
            WHERE 
                history_id = $6 RETURNING *`,
            [changed_at, old_status, new_status, ticket_id, changed_by_user_id, history_id]
        );
        return result.rows[0];
    }

    async delete(history_id) {
        const result = await pool.query('DELETE FROM statushistory WHERE history_id = $1 RETURNING *', [history_id]);
        return result.rows[0];
    }
}

export default new StatusHistory();
