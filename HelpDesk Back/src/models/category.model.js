import pool from '../config/db.js';

class Category {
    async findAll() {
        const result = await pool.query('SELECT * FROM category');
        return result.rows;
    }

    async findById(category_id) {
        const result = await pool.query('SELECT * FROM category WHERE category_id = $1', [category_id]);
        return result.rows[0];
    }

    async create(category_name) {
        const result = await pool.query('INSERT INTO category (category_name) VALUES ($1) RETURNING *', [category_name]);
        return result.rows[0];
    }

    async update(category_id, category_name) {
        const result = await pool.query('UPDATE category SET category_name = $1 WHERE category_id = $2 RETURNING *', [category_name, category_id]);
        return result.rows[0];
    }

    async delete(category_id) {
        const result = await pool.query('DELETE FROM category WHERE category_id = $1 RETURNING *', [category_id]);
        return result.rows[0];
    }
}

export default new Category();
