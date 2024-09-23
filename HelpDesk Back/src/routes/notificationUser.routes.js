import { Router } from 'express';
import NotificationUserController from '../controllers/notificationUser.controller.js';
import authenticateToken from '../middlewares/auth.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Notification_User
 *   description: API para la gestión de la relación entre notificaciones y usuarios
 */

/**
 * @swagger
 * /notification-users:
 *   get:
 *     summary: Obtiene todas las relaciones de notificaciones y usuarios
 *     tags: [Notification_User]
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
 *         description: Lista de relaciones de notificaciones y usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/NotificationUser'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get('/notification-users', authenticateToken, NotificationUserController.getAllNotificationUsers);

/**
 * @swagger
 * /notification-users/{notification_id}/{user_id}:
 *   get:
 *     summary: Obtiene una relación entre notificación y usuario por sus IDs
 *     tags: [Notification_User]
 *     parameters:
 *       - in: path
 *         name: notification_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la notificación
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Detalles de una relación entre notificación y usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotificationUser'
 *       404:
 *         description: Relación no encontrada
 *       401:
 *         description: No autorizado
 */
router.get('/notification-users/:notification_id/:user_id', authenticateToken, NotificationUserController.getNotificationUserByIds);

/**
 * @swagger
 * /notification-users:
 *   post:
 *     summary: Crea una nueva relación entre notificación y usuario
 *     tags: [Notification_User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateNotificationUserDto'
 *     responses:
 *       201:
 *         description: Relación creada exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error del servidor
 */
router.post('/notification-users', authenticateToken, NotificationUserController.createNotificationUser);

/**
 * @swagger
 * /notification-users/{notification_id}/{user_id}:
 *   put:
 *     summary: Actualiza una relación existente entre notificación y usuario
 *     tags: [Notification_User]
 *     parameters:
 *       - in: path
 *         name: notification_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la notificación
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateNotificationUserDto'
 *     responses:
 *       200:
 *         description: Relación actualizada exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Relación no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put('/notification-users/:notification_id/:user_id', authenticateToken, NotificationUserController.updateNotificationUser);

/**
 * @swagger
 * /notification-users/{notification_id}/{user_id}:
 *   delete:
 *     summary: Elimina una relación existente entre notificación y usuario
 *     tags: [Notification_User]
 *     parameters:
 *       - in: path
 *         name: notification_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la notificación
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Relación eliminada exitosamente
 *       404:
 *         description: Relación no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete('/notification-users/:notification_id/:user_id', authenticateToken, NotificationUserController.deleteNotificationUser);

export default router;
