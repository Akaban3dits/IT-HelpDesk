/**
 * @swagger
 * components:
 *   schemas:
 *     CreateDepartmentDto:
 *       type: object
 *       required:
 *         - department_name
 *       properties:
 *         department_name:
 *           type: string
 *           description: El nombre del departamento
 *       example:
 *         department_name: "Recursos Humanos"
 */

class CreateDepartmentDto {
    constructor({ department_name }) {
        this.department_name = department_name;
    }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateDepartmentDto:
 *       type: object
 *       required:
 *         - department_name
 *       properties:
 *         department_name:
 *           type: string
 *           description: El nombre del departamento
 *       example:
 *         department_name: "Recursos Humanos"
 */

class UpdateDepartmentDto {
    constructor({ department_name }) {
        this.department_name = department_name;
    }
}

export { CreateDepartmentDto, UpdateDepartmentDto };
