import pool from '../config/db.js';

class Role {
    async findAll() {
        const result = await pool.query('SELECT * FROM roles');
        return result.rows;
    }

    async findById(role_id) {
        const result = await pool.query('SELECT * FROM roles WHERE id = $1', [role_id]);
        return result.rows[0];
    }

    async create(role_name) {
        const result = await pool.query('INSERT INTO roles (role_name) VALUES ($1) RETURNING *', [role_name]);
        return result.rows[0];
    }

    async update(role_id, role_name) {
        const result = await pool.query('UPDATE roles SET role_name = $1 WHERE role_id = $2 RETURNING *', [role_name, role_id]);
        return result.rows[0];
    }

    async delete(role_id) {
        const result = await pool.query('DELETE FROM roles WHERE role_id = $1 RETURNING *', [role_id]);
        return result.rows[0];
    }
}

export default new Role();
