/**
 * @swagger
 * components:
 *   schemas:
 *     CreateUserDto:
 *       type: object
 *       required:
 *         - first_name
 *         - last_name
 *         - email
 *         - password
 *         - phone_number
 *         - status
 *         - company
 *         - role_id
 *         - department_id
 *       properties:
 *         first_name:
 *           type: string
 *           description: El nombre del usuario
 *         last_name:
 *           type: string
 *           description: El apellido del usuario
 *         email:
 *           type: string
 *           format: email
 *           description: El correo electrónico del usuario
 *         password:
 *           type: string
 *           format: password
 *           description: La contraseña del usuario
 *         phone_number:
 *           type: string
 *           description: El número de teléfono del usuario
 *         status:
 *           type: boolean
 *           description: Estado del usuario (activo/inactivo)
 *         company:
 *           type: boolean
 *           description: Indica si es una compañía o no
 *         role_id:
 *           type: integer
 *           description: El ID del rol del usuario
 *         department_id:
 *           type: integer
 *           description: El ID del departamento del usuario
 *       example:
 *         first_name: "Juan"
 *         last_name: "Pérez"
 *         email: "juan.perez@example.com"
 *         password: "strongpassword"
 *         phone_number: "1234567890"
 *         status: true
 *         company: false
 *         role_id: 1
 *         department_id: 2
 */

class CreateUserDto {
    constructor({ first_name, last_name, email, password, phone_number, status, company, role_id, department_id }) {
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.password = password;
        this.phone_number = phone_number;
        this.status = status;
        this.company = company;
        this.role_id = role_id;
        this.department_id = department_id;
    }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateUserDto:
 *       type: object
 *       required:
 *         - first_name
 *         - last_name
 *         - email
 *         - phone_number
 *         - status
 *         - company
 *         - role_id
 *         - department_id
 *       properties:
 *         first_name:
 *           type: string
 *           description: El nombre del usuario
 *         last_name:
 *           type: string
 *           description: El apellido del usuario
 *         email:
 *           type: string
 *           format: email
 *           description: El correo electrónico del usuario
 *         phone_number:
 *           type: string
 *           description: El número de teléfono del usuario
 *         status:
 *           type: boolean
 *           description: Estado del usuario (activo/inactivo)
 *         company:
 *           type: boolean
 *           description: Indica si es una compañía o no
 *         role_id:
 *           type: integer
 *           description: El ID del rol del usuario
 *         department_id:
 *           type: integer
 *           description: El ID del departamento del usuario
 *       example:
 *         first_name: "Juan"
 *         last_name: "Pérez"
 *         email: "juan.perez@example.com"
 *         phone_number: "1234567890"
 *         status: true
 *         company: false
 *         role_id: 1
 *         department_id: 2
 */

class UpdateUserDto {
    constructor({ first_name, last_name, email, phone_number, status, company, role_id, department_id }) {
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.phone_number = phone_number;
        this.status = status;
        this.company = company;
        this.role_id = role_id;
        this.department_id = department_id;
    }
}

export { CreateUserDto, UpdateUserDto };
