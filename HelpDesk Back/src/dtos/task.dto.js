/**
 * @swagger
 * components:
 *   schemas:
 *     CreateTaskDto:
 *       type: object
 *       required:
 *         - task_description
 *         - assigned_to_user_id
 *         - due_date
 *         - task_status_id
 *         - ticket_id
 *       properties:
 *         task_description:
 *           type: string
 *           description: La descripción de la tarea
 *         assigned_to_user_id:
 *           type: integer
 *           description: El ID del usuario asignado a la tarea
 *         due_date:
 *           type: string
 *           format: date-time
 *           description: La fecha límite de la tarea
 *         task_status_id:
 *           type: integer
 *           description: El ID del estado de la tarea
 *         ticket_id:
 *           type: integer
 *           description: El ID del ticket relacionado con la tarea
 *       example:
 *         task_description: "Reparar el sistema"
 *         assigned_to_user_id: 2
 *         due_date: "2024-09-01T10:00:00Z"
 *         task_status_id: 1
 *         ticket_id: 5
 */

class CreateTaskDto {
    constructor({ task_description, assigned_to_user_id, due_date, task_status_id, ticket_id }) {
        this.task_description = task_description;
        this.assigned_to_user_id = assigned_to_user_id;
        this.due_date = due_date;
        this.task_status_id = task_status_id;
        this.ticket_id = ticket_id;
    }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateTaskDto:
 *       type: object
 *       required:
 *         - task_description
 *         - assigned_to_user_id
 *         - due_date
 *         - task_status_id
 *         - ticket_id
 *       properties:
 *         task_description:
 *           type: string
 *           description: La descripción de la tarea
 *         assigned_to_user_id:
 *           type: integer
 *           description: El ID del usuario asignado a la tarea
 *         due_date:
 *           type: string
 *           format: date-time
 *           description: La fecha límite de la tarea
 *         task_status_id:
 *           type: integer
 *           description: El ID del estado de la tarea
 *         ticket_id:
 *           type: integer
 *           description: El ID del ticket relacionado con la tarea
 *       example:
 *         task_description: "Reparar el sistema"
 *         assigned_to_user_id: 2
 *         due_date: "2024-09-01T10:00:00Z"
 *         task_status_id: 1
 *         ticket_id: 5
 */

class UpdateTaskDto {
    constructor({ task_description, assigned_to_user_id, due_date, task_status_id, ticket_id }) {
        this.task_description = task_description;
        this.assigned_to_user_id = assigned_to_user_id;
        this.due_date = due_date;
        this.task_status_id = task_status_id;
        this.ticket_id = ticket_id;
    }
}

export { CreateTaskDto, UpdateTaskDto };
