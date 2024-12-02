import pool from '../config/db.js';

class Task {
     // Crear una tarea
     async createTask({ task_description, ticket_id }) {
        const query = `
            INSERT INTO tasks (task_description, ticket_id) 
            VALUES ($1, $2) 
            RETURNING *;
        `;
        const result = await pool.query(query, [task_description, ticket_id]);
        return result.rows[0];
    }

    // Actualizar una tarea
    async updateTask(id, { task_description, is_completed }) {
        const query = `
            UPDATE tasks 
            SET task_description = COALESCE($1, task_description),
                is_completed = COALESCE($2, is_completed)
            WHERE id = $3
            RETURNING *;
        `;
        const result = await pool.query(query, [task_description, is_completed, id]);
        return result.rows[0];
    }

    // Eliminar una tarea
    async deleteTask(id) {
        const query = `
            DELETE FROM tasks 
            WHERE id = $1;
        `;
        await pool.query(query, [id]);
    }

    // Obtener tareas por `ticket_id`
    async getTasksByTicketId(ticket_id) {
        const query = `
            SELECT * 
            FROM tasks 
            WHERE ticket_id = $1
            ORDER BY created_at DESC;
        `;
        const result = await pool.query(query, [ticket_id]);
        return result.rows;
    }
}

export default new Task();
