import NotificationUserModel from '../models/notificationUser.model.js';

class NotificationUserService {
    async createNotificationUser(notificationUserData) {
        return await NotificationUserModel.create(notificationUserData);
    }

    async getAllNotificationUsers() {
        return await NotificationUserModel.findAllByUser();
    }

    async getNotificationUserById(notificationId, userId) {
        return await NotificationUserModel.findById(notificationId, userId);
    }

    async updateNotificationUser(notificationId, userId, notificationUserData) {
        return await NotificationUserModel.update(notificationId, userId, notificationUserData);
    }

    async deleteNotificationUser(notificationId, userId) {
        return await NotificationUserModel.delete(notificationId, userId);
    }
}

export default new NotificationUserService();
