import { Router } from 'express';
import DeviceController from '../controllers/device.controller.js';
import authenticateToken from '../middlewares/auth.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Devices
 *   description: API para la gestión de dispositivos
 */

/**
 * @swagger
 * /devices:
 *   get:
 *     summary: Obtiene todos los dispositivos
 *     tags: [Devices]
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
 *         description: Lista de dispositivos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Device'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get('/devices', authenticateToken, DeviceController.getAllDevices);

/**
 * @swagger
 * /devices/{device_id}:
 *   get:
 *     summary: Obtiene un dispositivo por su ID
 *     tags: [Devices]
 *     parameters:
 *       - in: path
 *         name: device_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del dispositivo
 *     responses:
 *       200:
 *         description: Detalles de un dispositivo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Device'
 *       404:
 *         description: Dispositivo no encontrado
 *       401:
 *         description: No autorizado
 */
router.get('/devices/:device_id', authenticateToken, DeviceController.getDeviceById);

/**
 * @swagger
 * /devices:
 *   post:
 *     summary: Crea un nuevo dispositivo
 *     tags: [Devices]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDeviceDto'
 *     responses:
 *       201:
 *         description: Dispositivo creado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error del servidor
 */
router.post('/devices', authenticateToken, DeviceController.createDevice);

/**
 * @swagger
 * /devices/{device_id}:
 *   put:
 *     summary: Actualiza un dispositivo existente
 *     tags: [Devices]
 *     parameters:
 *       - in: path
 *         name: device_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del dispositivo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateDeviceDto'
 *     responses:
 *       200:
 *         description: Dispositivo actualizado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Dispositivo no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/devices/:device_id', authenticateToken, DeviceController.updateDevice);

/**
 * @swagger
 * /devices/{device_id}:
 *   delete:
 *     summary: Elimina un dispositivo existente
 *     tags: [Devices]
 *     parameters:
 *       - in: path
 *         name: device_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del dispositivo
 *     responses:
 *       200:
 *         description: Dispositivo eliminado exitosamente
 *       404:
 *         description: Dispositivo no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/devices/:device_id', authenticateToken, DeviceController.deleteDevice);

export default router;
