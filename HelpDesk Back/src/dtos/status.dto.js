/**
 * @swagger
 * components:
 *   schemas:
 *     CreateStatusDto:
 *       type: object
 *       required:
 *         - status_name
 *       properties:
 *         status_name:
 *           type: string
 *           description: El nombre del estado
 *       example:
 *         status_name: "Abierto"
 */

class CreateStatusDto {
    constructor({ status_name }) {
        this.status_name = status_name;
    }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateStatusDto:
 *       type: object
 *       required:
 *         - status_name
 *       properties:
 *         status_name:
 *           type: string
 *           description: El nombre del estado
 *       example:
 *         status_name: "Abierto"
 */

class UpdateStatusDto {
    constructor({ status_name }) {
        this.status_name = status_name;
    }
}

export { CreateStatusDto, UpdateStatusDto };
