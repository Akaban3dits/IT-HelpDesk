import NotificationUserService from '../services/notificationUser.service.js';

class NotificationUserController {
    async createNotificationUser(req, res) {
        try {
            const notificationUser = await NotificationUserService.createNotificationUser(req.body);
            return res.status(201).json(notificationUser);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getAllNotificationUsers(req, res) {
        try {
            const notificationUsers = await NotificationUserService.getAllNotificationUsers();
            return res.status(200).json(notificationUsers);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getNotificationUserById(req, res) {
        try {
            const notificationUser = await NotificationUserService.getNotificationUserById(req.params.notificationId, req.params.userId);
            if (!notificationUser) {
                return res.status(404).json({ message: 'Notification User relation not found' });
            }
            return res.status(200).json(notificationUser);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async updateNotificationUser(req, res) {
        try {
            const updatedNotificationUser = await NotificationUserService.updateNotificationUser(req.params.notificationId, req.params.userId, req.body);
            if (!updatedNotificationUser) {
                return res.status(404).json({ message: 'Notification User relation not found' });
            }
            return res.status(200).json(updatedNotificationUser);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async deleteNotificationUser(req, res) {
        try {
            const deletedNotificationUser = await NotificationUserService.deleteNotificationUser(req.params.notificationId, req.params.userId);
            if (!deletedNotificationUser) {
                return res.status(404).json({ message: 'Notification User relation not found' });
            }
            return res.status(200).json({ message: 'Notification User relation deleted successfully' });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export default new NotificationUserController();
