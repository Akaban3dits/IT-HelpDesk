import { Router } from 'express';
import NotificationController from '../controllers/notification.controller.js';
import authenticateToken from '../middlewares/auth.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: API para la gestión de notificaciones
 */

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Obtiene todas las notificaciones
 *     tags: [Notifications]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de la página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Cantidad de resultados por página
 *     responses:
 *       200:
 *         description: Lista de notificaciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get('/notifications', authenticateToken, NotificationController.getAllNotifications);

/**
 * @swagger
 * /notifications/{notification_id}:
 *   get:
 *     summary: Obtiene una notificación por su ID
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: notification_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la notificación
 *     responses:
 *       200:
 *         description: Detalles de una notificación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       404:
 *         description: Notificación no encontrada
 *       401:
 *         description: No autorizado
 */
router.get('/notifications/:notification_id', authenticateToken, NotificationController.getNotificationById);

/**
 * @swagger
 * /notifications:
 *   post:
 *     summary: Crea una nueva notificación
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateNotificationDto'
 *     responses:
 *       201:
 *         description: Notificación creada exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error del servidor
 */
router.post('/notifications', authenticateToken, NotificationController.createNotification);

/**
 * @swagger
 * /notifications/{notification_id}:
 *   put:
 *     summary: Actualiza una notificación existente
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: notification_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la notificación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateNotificationDto'
 *     responses:
 *       200:
 *         description: Notificación actualizada exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Notificación no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put('/notifications/:notification_id', authenticateToken, NotificationController.updateNotification);

/**
 * @swagger
 * /notifications/{notification_id}:
 *   delete:
 *     summary: Elimina una notificación existente
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: notification_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la notificación
 *     responses:
 *       200:
 *         description: Notificación eliminada exitosamente
 *       404:
 *         description: Notificación no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete('/notifications/:notification_id', authenticateToken, NotificationController.deleteNotification);

export default router;
