/**
 * @swagger
 * components:
 *   schemas:
 *     CreateRoleDto:
 *       type: object
 *       required:
 *         - role_name
 *       properties:
 *         role_name:
 *           type: string
 *           description: El nombre del rol
 *       example:
 *         role_name: "Admin"
 */

class CreateRoleDto {
    constructor({ role_name }) {
        this.role_name = role_name;
    }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateRoleDto:
 *       type: object
 *       required:
 *         - role_name
 *       properties:
 *         role_name:
 *           type: string
 *           description: El nombre del rol
 *       example:
 *         role_name: "Admin"
 */

class UpdateRoleDto {
    constructor({ role_name }) {
        this.role_name = role_name;
    }
}

export { CreateRoleDto, UpdateRoleDto };
