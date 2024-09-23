import { Router } from 'express';
import PriorityController from '../controllers/priority.controller.js';
import authenticateToken from '../middlewares/auth.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Priority
 *   description: API para la gestión de prioridades
 */

/**
 * @swagger
 * /priority:
 *   get:
 *     summary: Obtiene todas las prioridades
 *     tags: [Priority]
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
 *         description: Lista de prioridades
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Priority'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get('/priority', authenticateToken, PriorityController.getAllPriorities);

/**
 * @swagger
 * /priority/{priority_id}:
 *   get:
 *     summary: Obtiene una prioridad por su ID
 *     tags: [Priority]
 *     parameters:
 *       - in: path
 *         name: priority_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la prioridad
 *     responses:
 *       200:
 *         description: Detalles de una prioridad
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Priority'
 *       404:
 *         description: Prioridad no encontrada
 *       401:
 *         description: No autorizado
 */
router.get('/priority/:priority_id', authenticateToken, PriorityController.getPriorityById);

/**
 * @swagger
 * /priority:
 *   post:
 *     summary: Crea una nueva prioridad
 *     tags: [Priority]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePriorityDto'
 *     responses:
 *       201:
 *         description: Prioridad creada exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error del servidor
 */
router.post('/priority', authenticateToken, PriorityController.createPriority);

/**
 * @swagger
 * /priority/{priority_id}:
 *   put:
 *     summary: Actualiza una prioridad existente
 *     tags: [Priority]
 *     parameters:
 *       - in: path
 *         name: priority_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la prioridad
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePriorityDto'
 *     responses:
 *       200:
 *         description: Prioridad actualizada exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Prioridad no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put('/priority/:priority_id', authenticateToken, PriorityController.updatePriority);

/**
 * @swagger
 * /priority/{priority_id}:
 *   delete:
 *     summary: Elimina una prioridad existente
 *     tags: [Priority]
 *     parameters:
 *       - in: path
 *         name: priority_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la prioridad
 *     responses:
 *       200:
 *         description: Prioridad eliminada exitosamente
 *       404:
 *         description: Prioridad no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete('/priority/:priority_id', authenticateToken, PriorityController.deletePriority);

export default router;
