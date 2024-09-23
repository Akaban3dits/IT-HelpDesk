import { Router } from 'express';
import DeviceTypeController from '../controllers/deviceType.controller.js';
import authenticateToken from '../middlewares/auth.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: DeviceTypes
 *   description: API para la gestión de tipos de dispositivos
 */

/**
 * @swagger
 * /device-types:
 *   get:
 *     summary: Obtiene todos los tipos de dispositivos
 *     tags: [DeviceTypes]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de la página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Cantidad de resultados por página
 *     responses:
 *       200:
 *         description: Lista de tipos de dispositivos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DeviceType'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get('/device-types', authenticateToken, DeviceTypeController.getAllDeviceTypes);

/**
 * @swagger
 * /device-types/{device_type_id}:
 *   get:
 *     summary: Obtiene un tipo de dispositivo por su ID
 *     tags: [DeviceTypes]
 *     parameters:
 *       - in: path
 *         name: device_type_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del tipo de dispositivo
 *     responses:
 *       200:
 *         description: Detalles de un tipo de dispositivo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeviceType'
 *       404:
 *         description: Tipo de dispositivo no encontrado
 *       401:
 *         description: No autorizado
 */
router.get('/device-types/:device_type_id', authenticateToken, DeviceTypeController.getDeviceTypeById);

/**
 * @swagger
 * /device-types:
 *   post:
 *     summary: Crea un nuevo tipo de dispositivo
 *     tags: [DeviceTypes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDeviceTypeDto'
 *     responses:
 *       201:
 *         description: Tipo de dispositivo creado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error del servidor
 */
router.post('/device-types', authenticateToken, DeviceTypeController.createDeviceType);

/**
 * @swagger
 * /device-types/{device_type_id}:
 *   put:
 *     summary: Actualiza un tipo de dispositivo existente
 *     tags: [DeviceTypes]
 *     parameters:
 *       - in: path
 *         name: device_type_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del tipo de dispositivo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateDeviceTypeDto'
 *     responses:
 *       200:
 *         description: Tipo de dispositivo actualizado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Tipo de dispositivo no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/device-types/:device_type_id', authenticateToken, DeviceTypeController.updateDeviceType);

/**
 * @swagger
 * /device-types/{device_type_id}:
 *   delete:
 *     summary: Elimina un tipo de dispositivo existente
 *     tags: [DeviceTypes]
 *     parameters:
 *       - in: path
 *         name: device_type_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del tipo de dispositivo
 *     responses:
 *       200:
 *         description: Tipo de dispositivo eliminado exitosamente
 *       404:
 *         description: Tipo de dispositivo no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/device-types/:device_type_id', authenticateToken, DeviceTypeController.deleteDeviceType);

export default router;
