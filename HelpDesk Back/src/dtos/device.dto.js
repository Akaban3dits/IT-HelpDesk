/**
 * @swagger
 * components:
 *   schemas:
 *     CreateDeviceDto:
 *       type: object
 *       required:
 *         - device_name
 *         - serial_number
 *         - device_type_id
 *       properties:
 *         device_name:
 *           type: string
 *           description: El nombre del dispositivo
 *         serial_number:
 *           type: string
 *           description: El número de serie del dispositivo
 *         device_type_id:
 *           type: integer
 *           description: El ID del tipo de dispositivo
 *       example:
 *         device_name: "MacBook Pro"
 *         serial_number: "123ABC456"
 *         device_type_id: 1
 */

class CreateDeviceDto {
    constructor({ device_name, serial_number, device_type_id }) {
        this.device_name = device_name;
        this.serial_number = serial_number;
        this.device_type_id = device_type_id;
    }
}

class UpdateDeviceDto {
    constructor({ device_name, serial_number, device_type_id }) {
        this.device_name = device_name;
        this.serial_number = serial_number;
        this.device_type_id = device_type_id;
    }
}

export { CreateDeviceDto, UpdateDeviceDto };
