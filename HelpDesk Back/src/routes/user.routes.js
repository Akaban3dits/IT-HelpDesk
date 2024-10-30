import { Router } from 'express';
import UserController from '../controllers/user.controller.js';
import authenticateToken from '../middlewares/auth.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API para la gestión de usuarios
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtiene todos los usuarios con paginación, búsqueda y filtros
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Número de la página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Cantidad de resultados por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: john
 *         description: Búsqueda por nombre de usuario o email
 *       - in: query
 *         name: filterColumn
 *         schema:
 *           type: string
 *           example: role
 *         description: Columna por la cual filtrar
 *       - in: query
 *         name: filterValue
 *         schema:
 *           type: string
 *           example: admin
 *         description: Valor por el cual filtrar en la columna especificada
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           example: email
 *         description: Columna por la cual ordenar los resultados
 *       - in: query
 *         name: sortDirection
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           example: ASC
 *         description: Dirección del ordenamiento (ascendente o descendente)
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 current_page:
 *                   type: integer
 *                   example: 1
 *                 total_pages:
 *                   type: integer
 *                   example: 5
 *                 total_users:
 *                   type: integer
 *                   example: 50
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */

router.get('/users', authenticateToken, UserController.getAllUsers);


router.get('/users-names/search', authenticateToken, UserController.getAssignableUsers);

/**
 * @swagger
 * /users/{friendly_code}:
 *   get:
 *     summary: Obtiene un usuario por su friendly_code
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: friendly_code
 *         schema:
 *           type: string
 *         required: true
 *         description: Código amigable del usuario
 *     responses:
 *       200:
 *         description: Detalles de un usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuario no encontrado
 *       401:
 *         description: No autorizado
 */
router.get('/users/:friendly_code', authenticateToken, UserController.getUserByFriendlyCode);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Crea un nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserDto'
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error del servidor
 */
router.post('/users', UserController.createUser);

/**
 * @swagger
 * /users/{friendly_code}:
 *   put:
 *     summary: Actualiza un usuario existente
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: friendly_code
 *         schema:
 *           type: string
 *         required: true
 *         description: Código amigable del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserDto'
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/users/:friendly_code', authenticateToken, UserController.updateUser);

/**
 * @swagger
 * /users/{friendly_code}:
 *   delete:
 *     summary: Elimina un usuario existente
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: friendly_code
 *         schema:
 *           type: string
 *         required: true
 *         description: Código amigable del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/users/:friendly_code', authenticateToken, UserController.deleteUser);

/**
 * @swagger
 * /users/{friendly_code}/change-password:
 *   put:
 *     summary: Cambia la contraseña de un usuario existente
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: friendly_code
 *         schema:
 *           type: string
 *         required: true
 *         description: Código amigable del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 description: La nueva contraseña del usuario
 *               confirmPassword:
 *                 type: string
 *                 description: Confirmación de la nueva contraseña
 *             required:
 *               - newPassword
 *               - confirmPassword
 *     responses:
 *       200:
 *         description: Contraseña cambiada exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/users/:friendly_code/change-password', authenticateToken, UserController.changePassword);


export default router;
