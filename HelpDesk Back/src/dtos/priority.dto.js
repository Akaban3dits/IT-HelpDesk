/**
 * @swagger
 * components:
 *   schemas:
 *     CreatePriorityDto:
 *       type: object
 *       required:
 *         - priority_name
 *       properties:
 *         priority_name:
 *           type: string
 *           description: El nombre de la prioridad
 *       example:
 *         priority_name: "Alta"
 */

class CreatePriorityDto {
    constructor({ priority_name }) {
        this.priority_name = priority_name;
    }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdatePriorityDto:
 *       type: object
 *       required:
 *         - priority_name
 *       properties:
 *         priority_name:
 *           type: string
 *           description: El nombre de la prioridad
 *       example:
 *         priority_name: "Alta"
 */

class UpdatePriorityDto {
    constructor({ priority_name }) {
        this.priority_name = priority_name;
    }
}

export { CreatePriorityDto, UpdatePriorityDto };
