/**
 * @swagger
 * components:
 *   schemas:
 *     CreateTicketDto:
 *       type: object
 *       required:
 *         - description
 *         - status_id
 *         - priority_id
 *         - category_id
 *         - device_id
 *         - assigned_user_id
 *         - department_id
 *       properties:
 *         description:
 *           type: string
 *           description: La descripción del ticket
 *         status_id:
 *           type: integer
 *           description: El ID del estado del ticket
 *         priority_id:
 *           type: integer
 *           description: El ID de la prioridad del ticket
 *         category_id:
 *           type: integer
 *           description: El ID de la categoría del ticket
 *         device_id:
 *           type: integer
 *           description: El ID del dispositivo relacionado con el ticket
 *         assigned_user_id:
 *           type: integer
 *           description: El ID del usuario asignado al ticket
 *         department_id:
 *           type: integer
 *           description: El ID del departamento relacionado con el ticket
 *         parent_ticket_id:
 *           type: integer
 *           description: El ID del ticket padre (si aplica)
 *       example:
 *         description: "El sistema no enciende"
 *         status_id: 1
 *         priority_id: 2
 *         category_id: 3
 *         device_id: 4
 *         assigned_user_id: 5
 *         department_id: 6
 *         parent_ticket_id: null
 */

class CreateTicketDto {
    constructor({ description, status_id, priority_id, category_id, device_id, assigned_user_id, department_id, parent_ticket_id }) {
        this.description = description;
        this.status_id = status_id;
        this.priority_id = priority_id;
        this.category_id = category_id;
        this.device_id = device_id;
        this.assigned_user_id = assigned_user_id;
        this.department_id = department_id;
        this.parent_ticket_id = parent_ticket_id;
    }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateTicketDto:
 *       type: object
 *       required:
 *         - description
 *         - status_id
 *         - priority_id
 *         - category_id
 *         - device_id
 *         - assigned_user_id
 *         - department_id
 *       properties:
 *         description:
 *           type: string
 *           description: La descripción del ticket
 *         status_id:
 *           type: integer
 *           description: El ID del estado del ticket
 *         priority_id:
 *           type: integer
 *           description: El ID de la prioridad del ticket
 *         category_id:
 *           type: integer
 *           description: El ID de la categoría del ticket
 *         device_id:
 *           type: integer
 *           description: El ID del dispositivo relacionado con el ticket
 *         assigned_user_id:
 *           type: integer
 *           description: El ID del usuario asignado al ticket
 *         department_id:
 *           type: integer
 *           description: El ID del departamento relacionado con el ticket
 *         parent_ticket_id:
 *           type: integer
 *           description: El ID del ticket padre (si aplica)
 *       example:
 *         description: "El sistema no enciende"
 *         status_id: 1
 *         priority_id: 2
 *         category_id: 3
 *         device_id: 4
 *         assigned_user_id: 5
 *         department_id: 6
 *         parent_ticket_id: null
 */

class UpdateTicketDto {
    constructor({ description, status_id, priority_id, category_id, device_id, assigned_user_id, department_id, parent_ticket_id }) {
        this.description = description;
        this.status_id = status_id;
        this.priority_id = priority_id;
        this.category_id = category_id;
        this.device_id = device_id;
        this.assigned_user_id = assigned_user_id;
        this.department_id = department_id;
        this.parent_ticket_id = parent_ticket_id;
    }
}

export { CreateTicketDto, UpdateTicketDto };
