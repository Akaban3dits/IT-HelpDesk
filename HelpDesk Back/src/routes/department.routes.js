import { Router } from 'express';
import DepartmentController from '../controllers/department.controller.js';
import authenticateToken from '../middlewares/auth.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Departments
 *   description: API para la gestión de departamentos
 */

/**
 * @swagger
 * /departments:
 *   get:
 *     summary: Obtiene todos los departamentos
 *     tags: [Departments]
 *     responses:
 *       200:
 *         description: Lista de todos los departamentos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Department'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get('/departments', authenticateToken, DepartmentController.getAllDepartments);

/**
 * @swagger
 * /departments/search:
 *   get:
 *     summary: Busca departamentos y limita los resultados a 6
 *     tags: [Departments]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Término de búsqueda para filtrar departamentos por nombre
 *     responses:
 *       200:
 *         description: Lista de departamentos limitados a 6 resultados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Department'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get('/departments/search', DepartmentController.searchDepartments);

/**
 * @swagger
 * /departments/{department_id}:
 *   get:
 *     summary: Obtiene un departamento por su ID
 *     tags: [Departments]
 *     parameters:
 *       - in: path
 *         name: department_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del departamento
 *     responses:
 *       200:
 *         description: Detalles de un departamento
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Department'
 *       404:
 *         description: Departamento no encontrado
 *       401:
 *         description: No autorizado
 */
router.get('/departments/:department_id', authenticateToken, DepartmentController.getDepartmentById);

/**
 * @swagger
 * /departments:
 *   post:
 *     summary: Crea un nuevo departamento
 *     tags: [Departments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDepartmentDto'
 *     responses:
 *       201:
 *         description: Departamento creado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error del servidor
 */
router.post('/departments', authenticateToken, DepartmentController.createDepartment);

/**
 * @swagger
 * /departments/{department_id}:
 *   put:
 *     summary: Actualiza un departamento existente
 *     tags: [Departments]
 *     parameters:
 *       - in: path
 *         name: department_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del departamento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateDepartmentDto'
 *     responses:
 *       200:
 *         description: Departamento actualizado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Departamento no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/departments/:department_id', authenticateToken, DepartmentController.updateDepartment);

/**
 * @swagger
 * /departments/{department_id}:
 *   delete:
 *     summary: Elimina un departamento existente
 *     tags: [Departments]
 *     parameters:
 *       - in: path
 *         name: department_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del departamento
 *     responses:
 *       200:
 *         description: Departamento eliminado exitosamente
 *       404:
 *         description: Departamento no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/departments/:department_id', authenticateToken, DepartmentController.deleteDepartment);

export default router;
