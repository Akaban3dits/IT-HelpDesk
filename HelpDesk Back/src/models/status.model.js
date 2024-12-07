import pool from '../config/db.js';

class Status {
    async findAll() {
        const result = await pool.query('SELECT * FROM status');
        return result.rows;
    }

    async create(ticket_id, old_status, new_status, changed_by_user_id) {
        try {
            const result = await pool.query(
                `INSERT INTO status_history (ticket_id, old_status, new_status, changed_by_user_id, changed_at)
                 VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,
                [ticket_id, old_status, new_status, changed_by_user_id]
            );

            return result.rows[0]; // Retorna el registro creado
        } catch (error) {
            console.error('Error al crear el registro de historial de estado:', error.message);
            throw new Error('No se pudo registrar el cambio de estado: ' + error.message); // Proporcionar más información en el error
        }
    }


    async getStatusHistoryByTicketId(ticketId) {
        try {
            const result = await pool.query(
                `SELECT 
                    sh.id, 
                    sh.changed_at, 
                    sh.old_status, 
                    sh.new_status, 
                    sh.ticket_id,
                    json_build_object(
                        'id', u.friendly_code,
                        'first_name', u.first_name,
                        'last_name', u.last_name
                    ) AS changed_by_user
                 FROM status_history sh
                 JOIN tickets t ON sh.ticket_id = t.friendly_code
                 LEFT JOIN users u ON sh.changed_by_user_id = u.friendly_code
                 WHERE sh.ticket_id = $1 
                 ORDER BY sh.changed_at DESC`,
                [ticketId]
            );
    
            return result.rows.map(row => ({
                id: row.id,
                changed_at: row.changed_at,
                old_status: row.old_status,
                new_status: row.new_status,
                ticket_id: row.ticket_id,
                changed_by: row.changed_by_user
            }));
        } catch (error) {
            console.error('Error al obtener el historial de estados:', error.message);
            throw new Error('No se pudo obtener el historial de estados');
        }
    }

    async getStatusIdByName(statusName) {
        try {
            const result = await pool.query(
                `SELECT id FROM status WHERE status_name = $1 LIMIT 1`,
                [statusName]
            );
            return result.rows[0]?.id || null;
        } catch (error) {
            throw error; // Capturar y lanzar cualquier error en la consulta
        }
    }
    async getStatusNameById(status_id) {
        try {
            const result = await pool.query(
                `SELECT status_name FROM status WHERE id = $1`,
                [status_id]
            );
            return result.rows[0]?.status_name || null; // Retorna el nombre del estado o null si no existe
        } catch (error) {
            console.error('Error al obtener el nombre del estado:', error.message);
            throw new Error('No se pudo obtener el nombre del estado');
        }
    }

}

export default new Status();
