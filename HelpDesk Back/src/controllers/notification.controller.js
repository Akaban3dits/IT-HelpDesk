import NotificationService from '../services/notification.service.js';

class NotificationController {
    async usernotification(req, res) {
        try {
            const user_id = req.user.id;
            const notification = await NotificationService.getusernotifications(user_id);
            return res.status(200).json(notification);

        } catch (error) {
            next(error);
        }
    }
}

export default new NotificationController();
