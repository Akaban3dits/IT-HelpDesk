/**
 * @swagger
 * components:
 *   schemas:
 *     CreateDeviceTypeDto:
 *       type: object
 *       required:
 *         - device_type_name
 *       properties:
 *         device_type_name:
 *           type: string
 *           description: El nombre del tipo de dispositivo
 *       example:
 *         device_type_name: "Laptop"
 */

class CreateDeviceTypeDto {
    constructor({ device_type_name }) {
        this.device_type_name = device_type_name;
    }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateDeviceTypeDto:
 *       type: object
 *       required:
 *         - device_type_name
 *       properties:
 *         device_type_name:
 *           type: string
 *           description: El nombre del tipo de dispositivo
 *       example:
 *         device_type_name: "Laptop"
 */

class UpdateDeviceTypeDto {
    constructor({ device_type_name }) {
        this.device_type_name = device_type_name;
    }
}

export { CreateDeviceTypeDto, UpdateDeviceTypeDto };
