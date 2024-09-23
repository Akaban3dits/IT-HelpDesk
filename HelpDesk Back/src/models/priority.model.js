import pool from '../config/db.js';

class Priority {
    async findAll() {
        const result = await pool.query('SELECT * FROM priority');
        return result.rows;
    }

    async findById(priority_id) {
        const result = await pool.query('SELECT * FROM priority WHERE priority_id = $1', [priority_id]);
        return result.rows[0];
    }

    async create(priority_name) {
        const result = await pool.query('INSERT INTO priority (priority_name) VALUES ($1) RETURNING *', [priority_name]);
        return result.rows[0];
    }

    async update(priority_id, priority_name) {
        const result = await pool.query('UPDATE priority SET priority_name = $1 WHERE priority_id = $2 RETURNING *', [priority_name, priority_id]);
        return result.rows[0];
    }

    async delete(priority_id) {
        const result = await pool.query('DELETE FROM priority WHERE priority_id = $1 RETURNING *', [priority_id]);
        return result.rows[0];
    }
}

export default new Priority();
