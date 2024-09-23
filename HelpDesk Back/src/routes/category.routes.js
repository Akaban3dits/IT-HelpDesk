import { Router } from 'express';
import CategoryController from '../controllers/category.controller.js';
import authenticateToken from '../middlewares/auth.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API para la gestión de categorías
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Obtiene todas las categorías
 *     tags: [Categories]
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
 *         description: Lista de categorías
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get('/categories', authenticateToken, CategoryController.getAllCategories);

/**
 * @swagger
 * /categories/{category_id}:
 *   get:
 *     summary: Obtiene una categoría por su ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: category_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la categoría
 *     responses:
 *       200:
 *         description: Detalles de una categoría
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Categoría no encontrada
 *       401:
 *         description: No autorizado
 */
router.get('/categories/:category_id', authenticateToken, CategoryController.getCategoryById);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Crea una nueva categoría
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategoryDto'
 *     responses:
 *       201:
 *         description: Categoría creada exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error del servidor
 */
router.post('/categories', authenticateToken, CategoryController.createCategory);

/**
 * @swagger
 * /categories/{category_id}:
 *   put:
 *     summary: Actualiza una categoría existente
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: category_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la categoría
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCategoryDto'
 *     responses:
 *       200:
 *         description: Categoría actualizada exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put('/categories/:category_id', authenticateToken, CategoryController.updateCategory);

/**
 * @swagger
 * /categories/{category_id}:
 *   delete:
 *     summary: Elimina una categoría existente
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: category_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la categoría
 *     responses:
 *       200:
 *         description: Categoría eliminada exitosamente
 *       404:
 *         description: Categoría no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete('/categories/:category_id', authenticateToken, CategoryController.deleteCategory);

export default router;
