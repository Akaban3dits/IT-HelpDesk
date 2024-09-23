/**
 * @swagger
 * components:
 *   schemas:
 *     CreateNotificationUserDto:
 *       type: object
 *       required:
 *         - notification_id
 *         - user_id
 *         - read_at
 *       properties:
 *         notification_id:
 *           type: integer
 *           description: El ID de la notificación
 *         user_id:
 *           type: integer
 *           description: El ID del usuario
 *         read_at:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de lectura de la notificación
 *       example:
 *         notification_id: 1
 *         user_id: 2
 *         read_at: "2024-08-25T10:00:00Z"
 */

class CreateNotificationUserDto {
    constructor({ notification_id, user_id, read_at }) {
        this.notification_id = notification_id;
        this.user_id = user_id;
        this.read_at = read_at;
    }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateNotificationUserDto:
 *       type: object
 *       required:
 *         - notification_id
 *         - user_id
 *         - read_at
 *       properties:
 *         notification_id:
 *           type: integer
 *           description: El ID de la notificación
 *         user_id:
 *           type: integer
 *           description: El ID del usuario
 *         read_at:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de lectura de la notificación
 *       example:
 *         notification_id: 1
 *         user_id: 2
 *         read_at: "2024-08-25T10:00:00Z"
 */

class UpdateNotificationUserDto {
    constructor({ notification_id, user_id, read_at }) {
        this.notification_id = notification_id;
        this.user_id = user_id;
        this.read_at = read_at;
    }
}

export { CreateNotificationUserDto, UpdateNotificationUserDto };
