import { Router } from 'express';
import authenticateToken from '../middlewares/auth.js';
import NotificationController from '../controllers/notification.controller.js'

const router = Router();

//TODO Realizar un buscador de al menos 20 registros + Que no sean leidos + ID

router.get('/notifications', authenticateToken, NotificationController.usernotification)

export default router;
