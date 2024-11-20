import NotificationModel from '../models/notification.model.js';

class NotificationService {
    async getusernotifications(user_id){
        try {
            const notificaciones = await NotificationModel.getusernotifications(user_id);
            return notificaciones;

        } catch (error) {
            console.log("Data error service")
        }
    }
}

export default new NotificationService();
