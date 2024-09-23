import { Router } from 'express';
import TaskController from '../controllers/task.controller.js';
import authenticateToken from '../middlewares/auth.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: API para la gestión de tareas
 */

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Obtiene todas las tareas
 *     tags: [Tasks]
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
 *         description: Lista de tareas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get('/tasks', authenticateToken, TaskController.getAllTasks);

/**
 * @swagger
 * /tasks/{task_id}:
 *   get:
 *     summary: Obtiene una tarea por su ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: task_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la tarea
 *     responses:
 *       200:
 *         description: Detalles de una tarea
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Tarea no encontrada
 *       401:
 *         description: No autorizado
 */
router.get('/tasks/:task_id', authenticateToken, TaskController.getTaskById);

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Crea una nueva tarea
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTaskDto'
 *     responses:
 *       201:
 *         description: Tarea creada exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error del servidor
 */
router.post('/tasks', authenticateToken, TaskController.createTask);

/**
 * @swagger
 * /tasks/{task_id}:
 *   put:
 *     summary: Actualiza una tarea existente
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: task_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la tarea
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTaskDto'
 *     responses:
 *       200:
 *         description: Tarea actualizada exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Tarea no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put('/tasks/:task_id', authenticateToken, TaskController.updateTask);

/**
 * @swagger
 * /tasks/{task_id}:
 *   delete:
 *     summary: Elimina una tarea existente
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: task_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la tarea
 *     responses:
 *       200:
 *         description: Tarea eliminada exitosamente
 *       404:
 *         description: Tarea no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete('/tasks/:task_id', authenticateToken, TaskController.deleteTask);

export default router;
