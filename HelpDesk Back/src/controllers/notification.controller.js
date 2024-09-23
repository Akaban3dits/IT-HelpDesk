import NotificationService from '../services/notification.service.js';

class NotificationController {
    async createNotification(req, res) {
        try {
            const notification = await NotificationService.createNotification(req.body);
            return res.status(201).json(notification);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getAllNotifications(req, res) {
        try {
            const notifications = await NotificationService.getAllNotifications();
            return res.status(200).json(notifications);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getNotificationById(req, res) {
        try {
            const notification = await NotificationService.getNotificationById(req.params.id);
            if (!notification) {
                return res.status(404).json({ message: 'Notification not found' });
            }
            return res.status(200).json(notification);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async updateNotification(req, res) {
        try {
            const updatedNotification = await NotificationService.updateNotification(req.params.id, req.body);
            if (!updatedNotification) {
                return res.status(404).json({ message: 'Notification not found' });
            }
            return res.status(200).json(updatedNotification);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async deleteNotification(req, res) {
        try {
            const deletedNotification = await NotificationService.deleteNotification(req.params.id);
            if (!deletedNotification) {
                return res.status(404).json({ message: 'Notification not found' });
            }
            return res.status(200).json({ message: 'Notification deleted successfully' });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export default new NotificationController();
