import NotificationModel from '../models/notification.model.js';

class NotificationService {
    async createNotification(notificationData) {
        return await NotificationModel.create(notificationData);
    }

    async getAllNotifications() {
        return await NotificationModel.findAll();
    }

    async getNotificationById(notificationId) {
        return await NotificationModel.findById(notificationId);
    }

    async updateNotification(notificationId, notificationData) {
        return await NotificationModel.update(notificationId, notificationData);
    }

    async deleteNotification(notificationId) {
        return await NotificationModel.delete(notificationId);
    }
}

export default new NotificationService();
