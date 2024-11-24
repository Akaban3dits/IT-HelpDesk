import pool from '../config/db.js';

class Notification {
    async getUserNotifications(userId) {
        try {
            const query = `
                SELECT 
                    n.id AS notification_id, 
                    n.ticket_id,
                    n.message, 
                    n.type,
                    n.created_at, 
                    nu.read_at,
                    nu.hidden
                FROM notifications n 
                JOIN notification_user nu 
                ON n.id = nu.notification_id 
                WHERE nu.user_id = $1 
                AND (nu.hidden IS NULL OR nu.hidden = false) -- Filtrar notificaciones no ocultas
                ORDER BY n.created_at DESC 
                LIMIT 15;
            `;
            const result = await pool.query(query, [userId]);
            return result.rows;
        } catch (error) {
            console.error('Error al obtener notificaciones:', error.message);
            throw new Error('No se pudieron obtener las notificaciones.');
        }
    }
    
    async updateNotificationStatus(notificationId, userId, updates) {
        try {
            const { read_at, hidden } = updates;

            const query = `
                UPDATE notification_user
                SET 
                    read_at = COALESCE($1, read_at), 
                    hidden = COALESCE($2, hidden)
                WHERE notification_id = $3 AND user_id = $4
                RETURNING *;
            `;

            const values = [read_at, hidden, notificationId, userId];
            const result = await pool.query(query, values);

            return result.rows[0] || null; // Devuelve el registro actualizado o null si no existe
        } catch (error) {
            console.error('Error actualizando el estado de la notificación:', error.message);
            throw new Error('No se pudo actualizar el estado de la notificación.');
        }
    }
    

    async createNotification(ticket_id, message, type) {
        const result = await pool.query(
            `INSERT INTO notifications (ticket_id, message, type, created_at)
             VALUES ($1, $2, $3, NOW()) RETURNING id`,
            [ticket_id, message, type]
        );
        return result.rows[0];
    }

    async associateNotificationWithUsers(notification_id, user_ids) {
        const values = user_ids.map((user_id) => [notification_id, user_id]);
        const query = `
            INSERT INTO notification_user (notification_id, user_id) 
            VALUES ${values.map((_, i) => `($${i * 2 + 1}, $${i * 2 + 2})`).join(', ')}
        `;
        const params = values.flat();
        await pool.query(query, params);
    }
}

export default new Notification();
