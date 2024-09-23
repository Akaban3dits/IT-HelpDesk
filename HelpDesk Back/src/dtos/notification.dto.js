/**
 * @swagger
 * components:
 *   schemas:
 *     CreateNotificationDto:
 *       type: object
 *       required:
 *         - message
 *         - created_at
 *         - ticket_id
 *       properties:
 *         message:
 *           type: string
 *           description: El mensaje de la notificación
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de la notificación
 *         ticket_id:
 *           type: integer
 *           description: El ID del ticket asociado (si aplica)
 *       example:
 *         message: "El ticket ha sido actualizado"
 *         created_at: "2024-08-25T10:00:00Z"
 *         ticket_id: 1
 */

class CreateNotificationDto {
    constructor({ message, created_at, ticket_id }) {
        this.message = message;
        this.created_at = created_at;
        this.ticket_id = ticket_id;
    }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateNotificationDto:
 *       type: object
 *       required:
 *         - message
 *         - created_at
 *         - ticket_id
 *       properties:
 *         message:
 *           type: string
 *           description: El mensaje de la notificación
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de la notificación
 *         ticket_id:
 *           type: integer
 *           description: El ID del ticket asociado (si aplica)
 *       example:
 *         message: "El ticket ha sido actualizado"
 *         created_at: "2024-08-25T10:00:00Z"
 *         ticket_id: 1
 */

class UpdateNotificationDto {
    constructor({ message, created_at, ticket_id }) {
        this.message = message;
        this.created_at = created_at;
        this.ticket_id = ticket_id;
    }
}

export { CreateNotificationDto, UpdateNotificationDto };
