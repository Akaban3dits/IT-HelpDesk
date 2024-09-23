import pool from '../config/db.js';

class Status {
    async findAll() {
        const result = await pool.query('SELECT * FROM status');
        return result.rows;
    }

    async findById(status_id) {
        const result = await pool.query('SELECT * FROM status WHERE status_id = $1', [status_id]);
        return result.rows[0];
    }

    async create(status_name) {
        const result = await pool.query('INSERT INTO status (status_name) VALUES ($1) RETURNING *', [status_name]);
        return result.rows[0];
    }

    async update(status_id, status_name) {
        const result = await pool.query('UPDATE status SET status_name = $1 WHERE status_id = $2 RETURNING *', [status_name, status_id]);
        return result.rows[0];
    }

    async delete(status_id) {
        const result = await pool.query('DELETE FROM status WHERE status_id = $1 RETURNING *', [status_id]);
        return result.rows[0];
    }
}

export default new Status();
