import pool from '../config/db.js';

class Task {
    async findById(task_id) {
        const result = await pool.query('SELECT * FROM tasks WHERE task_id = $1', [task_id]);
        return result.rows[0];
    }

    async findAll({ page, limit }) {
        const offset = (page - 1) * limit;
        const result = await pool.query(
            `SELECT task_id, task_description, due_date, task_status_id, ticket_id, assigned_to_user_id 
             FROM tasks ORDER BY due_date DESC LIMIT $1 OFFSET $2`, 
            [limit, offset]
        );

        return result.rows;
    }

    async create({ task_description, due_date, task_status_id, ticket_id, assigned_to_user_id }) {
        const result = await pool.query(
            `INSERT INTO tasks (task_description, due_date, task_status_id, ticket_id, assigned_to_user_id)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [task_description, due_date, task_status_id, ticket_id, assigned_to_user_id]
        );
        return result.rows[0];
    }

    async update(task_id, { task_description, due_date, task_status_id, ticket_id, assigned_to_user_id }) {
        const result = await pool.query(
            `UPDATE tasks SET 
                task_description = $1,
                due_date = $2,
                task_status_id = $3,
                ticket_id = $4,
                assigned_to_user_id = $5
            WHERE 
                task_id = $6 RETURNING *`,
            [task_description, due_date, task_status_id, ticket_id, assigned_to_user_id, task_id]
        );
        return result.rows[0];
    }

    async delete(task_id) {
        const result = await pool.query('DELETE FROM tasks WHERE task_id = $1 RETURNING *', [task_id]);
        return result.rows[0];
    }
}

export default new Task();
