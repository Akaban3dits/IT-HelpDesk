import NotificationModel from '../models/notification.model.js';

class NotificationService {
    async getUserNotifications(userId) {
        try {
            // Llamar al modelo para obtener las notificaciones del usuario
            const notifications = await NotificationModel.getUserNotifications(userId);
            return notifications;
        } catch (error) {
            console.error('Error en getUserNotifications (NotificationService):', error.message);
            throw new Error('No se pudieron recuperar las notificaciones del usuario.');
        }
    }

    async updateNotificationStatus(notificationId, userId, updates) {
        try {
            const updatedNotification = await NotificationModel.updateNotificationStatus(notificationId, userId, updates);
            if (!updatedNotification) {
                throw new Error('La notificación no existe o no pertenece al usuario.');
            }
            return updatedNotification;
        } catch (error) {
            console.error('Error en NotificationService.updateNotificationStatus:', error.message);
            throw error;
        }
    }
    

    async createNotification({ ticket_id, type, message, recipients }) {
        try {
            // Crear la notificación
            const notification = await NotificationModel.createNotification(ticket_id, message, type);
    
            // Asociar la notificación con los usuarios
            if (recipients && recipients.length > 0) {
                await NotificationModel.associateNotificationWithUsers(notification.id, recipients);
            }
        } catch (error) {
            console.error('Error al crear la notificación:', error.message);
            throw new Error('No se pudo crear la notificación.');
        }
    }
    
}

export default new NotificationService();
