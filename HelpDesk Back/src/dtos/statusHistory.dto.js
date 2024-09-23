/**
 * @swagger
 * components:
 *   schemas:
 *     CreateStatusHistoryDto:
 *       type: object
 *       required:
 *         - old_status
 *         - new_status
 *         - ticket_id
 *         - changed_by_user_id
 *       properties:
 *         old_status:
 *           type: string
 *           description: El estado anterior
 *         new_status:
 *           type: string
 *           description: El nuevo estado
 *         ticket_id:
 *           type: integer
 *           description: El ID del ticket asociado
 *         changed_by_user_id:
 *           type: integer
 *           description: El ID del usuario que cambió el estado
 *       example:
 *         old_status: "Abierto"
 *         new_status: "En progreso"
 *         ticket_id: 1
 *         changed_by_user_id: 2
 */

class CreateStatusHistoryDto {
    constructor({ old_status, new_status, ticket_id, changed_by_user_id }) {
        this.old_status = old_status;
        this.new_status = new_status;
        this.ticket_id = ticket_id;
        this.changed_by_user_id = changed_by_user_id;
    }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateStatusHistoryDto:
 *       type: object
 *       required:
 *         - old_status
 *         - new_status
 *         - ticket_id
 *         - changed_by_user_id
 *       properties:
 *         old_status:
 *           type: string
 *           description: El estado anterior
 *         new_status:
 *           type: string
 *           description: El nuevo estado
 *         ticket_id:
 *           type: integer
 *           description: El ID del ticket asociado
 *         changed_by_user_id:
 *           type: integer
 *           description: El ID del usuario que cambió el estado
 *       example:
 *         old_status: "Abierto"
 *         new_status: "En progreso"
 *         ticket_id: 1
 *         changed_by_user_id: 2
 */

class UpdateStatusHistoryDto {
    constructor({ old_status, new_status, ticket_id, changed_by_user_id }) {
        this.old_status = old_status;
        this.new_status = new_status;
        this.ticket_id = ticket_id;
        this.changed_by_user_id = changed_by_user_id;
    }
}

export { CreateStatusHistoryDto, UpdateStatusHistoryDto };
