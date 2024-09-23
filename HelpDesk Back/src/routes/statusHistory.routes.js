import { Router } from 'express';
import StatusHistoryController from '../controllers/statusHistory.controller.js';
import authenticateToken from '../middlewares/auth.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: StatusHistory
 *   description: API para la gestión del historial de estados
 */

/**
 * @swagger
 * /status-history:
 *   get:
 *     summary: Obtiene todos los registros de historial de estados
 *     tags: [StatusHistory]
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
 *         description: Lista de registros de historial de estados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StatusHistory'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get('/status-history', authenticateToken, StatusHistoryController.getAllStatusHistories);

/**
 * @swagger
 * /status-history/{history_id}:
 *   get:
 *     summary: Obtiene un registro de historial de estado por su ID
 *     tags: [StatusHistory]
 *     parameters:
 *       - in: path
 *         name: history_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del historial de estado
 *     responses:
 *       200:
 *         description: Detalles de un historial de estado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StatusHistory'
 *       404:
 *         description: Historial de estado no encontrado
 *       401:
 *         description: No autorizado
 */
router.get('/status-history/:history_id', authenticateToken, StatusHistoryController.getStatusHistoryById);

/**
 * @swagger
 * /status-history:
 *   post:
 *     summary: Crea un nuevo registro de historial de estado
 *     tags: [StatusHistory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateStatusHistoryDto'
 *     responses:
 *       201:
 *         description: Historial de estado creado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error del servidor
 */
router.post('/status-history', authenticateToken, StatusHistoryController.createStatusHistory);

/**
 * @swagger
 * /status-history/{history_id}:
 *   put:
 *     summary: Actualiza un registro de historial de estado existente
 *     tags: [StatusHistory]
 *     parameters:
 *       - in: path
 *         name: history_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del historial de estado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateStatusHistoryDto'
 *     responses:
 *       200:
 *         description: Historial de estado actualizado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Historial de estado no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/status-history/:history_id', authenticateToken, StatusHistoryController.updateStatusHistory);

/**
 * @swagger
 * /status-history/{history_id}:
 *   delete:
 *     summary: Elimina un registro de historial de estado existente
 *     tags: [StatusHistory]
 *     parameters:
 *       - in: path
 *         name: history_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del historial de estado
 *     responses:
 *       200:
 *         description: Historial de estado eliminado exitosamente
 *       404:
 *         description: Historial de estado no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/status-history/:history_id', authenticateToken, StatusHistoryController.deleteStatusHistory);

export default router;
