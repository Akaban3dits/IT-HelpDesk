import { Router } from 'express';
import StatusController from '../controllers/status.controller.js';
import authenticateToken from '../middlewares/auth.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Status
 *   description: API para la gestión de estados
 */

/**
 * @swagger
 * /status:
 *   get:
 *     summary: Obtiene todos los estados
 *     tags: [Status]
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
 *         description: Lista de estados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Status'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get('/status', authenticateToken, StatusController.getAllStatuses);

/**
 * @swagger
 * /status/{status_id}:
 *   get:
 *     summary: Obtiene un estado por su ID
 *     tags: [Status]
 *     parameters:
 *       - in: path
 *         name: status_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del estado
 *     responses:
 *       200:
 *         description: Detalles de un estado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Status'
 *       404:
 *         description: Estado no encontrado
 *       401:
 *         description: No autorizado
 */
router.get('/status/:status_id', authenticateToken, StatusController.getStatusById);

/**
 * @swagger
 * /status:
 *   post:
 *     summary: Crea un nuevo estado
 *     tags: [Status]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateStatusDto'
 *     responses:
 *       201:
 *         description: Estado creado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error del servidor
 */
router.post('/status', authenticateToken, StatusController.createStatus);

/**
 * @swagger
 * /status/{status_id}:
 *   put:
 *     summary: Actualiza un estado existente
 *     tags: [Status]
 *     parameters:
 *       - in: path
 *         name: status_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del estado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateStatusDto'
 *     responses:
 *       200:
 *         description: Estado actualizado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Estado no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/status/:status_id', authenticateToken, StatusController.updateStatus);

/**
 * @swagger
 * /status/{status_id}:
 *   delete:
 *     summary: Elimina un estado existente
 *     tags: [Status]
 *     parameters:
 *       - in: path
 *         name: status_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del estado
 *     responses:
 *       200:
 *         description: Estado eliminado exitosamente
 *       404:
 *         description: Estado no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/status/:status_id', authenticateToken, StatusController.deleteStatus);

export default router;
