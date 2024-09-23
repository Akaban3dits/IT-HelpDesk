import { Router } from 'express';
import RoleController from '../controllers/role.controller.js';
import authenticateToken from '../middlewares/auth.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: API para la gestión de roles
 */

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Obtiene todos los roles
 *     tags: [Roles]
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
 *         description: Lista de roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get('/roles', RoleController.getAllRoles);

/**
 * @swagger
 * /roles/{role_id}:
 *   get:
 *     summary: Obtiene un rol por su ID
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: role_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del rol
 *     responses:
 *       200:
 *         description: Detalles de un rol
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       404:
 *         description: Rol no encontrado
 *       401:
 *         description: No autorizado
 */
router.get('/roles/:role_id', authenticateToken, RoleController.getRoleById);

/**
 * @swagger
 * /roles:
 *   post:
 *     summary: Crea un nuevo rol
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRoleDto'
 *     responses:
 *       201:
 *         description: Rol creado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error del servidor
 */
router.post('/roles', authenticateToken, RoleController.createRole);

/**
 * @swagger
 * /roles/{role_id}:
 *   put:
 *     summary: Actualiza un rol existente
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: role_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del rol
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRoleDto'
 *     responses:
 *       200:
 *         description: Rol actualizado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Rol no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/roles/:role_id', authenticateToken, RoleController.updateRole);

/**
 * @swagger
 * /roles/{role_id}:
 *   delete:
 *     summary: Elimina un rol existente
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: role_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del rol
 *     responses:
 *       200:
 *         description: Rol eliminado exitosamente
 *       404:
 *         description: Rol no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/roles/:role_id', authenticateToken, RoleController.deleteRole);

export default router;
