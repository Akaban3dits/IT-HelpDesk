import NotificationService from '../services/notification.service.js';

class NotificationController {
    async userNotifications(req, res, next) {
        try {
            const userId = req.user.id; // Obtiene el ID del usuario autenticado
            const notifications = await NotificationService.getUserNotifications(userId);
            return res.status(200).json(notifications);
        } catch (error) {
            console.error('Error en userNotifications (NotificationController):', error.message);
            next(error); // Pasar el error al middleware de manejo de errores
        }
    }

    async updateNotification(req, res, next) {
        try {
            const { notificationId } = req.params;
            const userId = req.user.id; // Asume que el middleware de autenticación agrega el ID del usuario
            const { read_at, hidden } = req.body;

            // Validar datos de entrada
            if (!notificationId) {
                return res.status(400).json({ error: 'El ID de la notificación es requerido.' });
            }

            // Actualizar la notificación
            const updatedNotification = await NotificationService.updateNotificationStatus(notificationId, userId, {
                read_at: read_at ? new Date(read_at) : null,
                hidden: hidden !== undefined ? hidden : null,
            });

            return res.status(200).json(updatedNotification);
        } catch (error) {
            console.error('Error en NotificationController.updateNotification:', error.message);
            next(error);
        }
    }
    
}

export default new NotificationController();
