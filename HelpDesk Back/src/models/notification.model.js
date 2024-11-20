import pool from '../config/db.js';

class Notification {
    async getusernotifications(user_id){
        try {
            const result = 
            await pool.query
            ('SELECT n.id AS notification_id, n.message, n.created_at, nu.read_at FROM notifications n JOIN notification_user nu ON n.id = nu.notification_id WHERE nu.user_id = $1 AND nu.read_at IS NOT NULL ORDER BY n.created_at DESC LIMIT 20;', [user_id]);
            return result.rows;
        } catch (error) {
            console.log("Error al obtener los registros de notificaciones");
        }
    }
}

export default new Notification();
