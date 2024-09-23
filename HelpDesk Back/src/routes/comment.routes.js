import { Router } from 'express';
import CommentController from '../controllers/comment.controller.js';
import authenticateToken from '../middlewares/auth.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: API para la gestión de comentarios
 */

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Obtiene todos los comentarios
 *     tags: [Comments]
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
 *         description: Lista de comentarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get('/comments', authenticateToken, CommentController.getAllComments);

/**
 * @swagger
 * /comments/{comment_id}:
 *   get:
 *     summary: Obtiene un comentario por su ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: comment_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del comentario
 *     responses:
 *       200:
 *         description: Detalles de un comentario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Comentario no encontrado
 *       401:
 *         description: No autorizado
 */
router.get('/comments/:comment_id', authenticateToken, CommentController.getCommentById);

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Crea un nuevo comentario
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCommentDto'
 *     responses:
 *       201:
 *         description: Comentario creado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error del servidor
 */
router.post('/comments', authenticateToken, CommentController.createComment);

/**
 * @swagger
 * /comments/{comment_id}:
 *   put:
 *     summary: Actualiza un comentario existente
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: comment_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del comentario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCommentDto'
 *     responses:
 *       200:
 *         description: Comentario actualizado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Comentario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/comments/:comment_id', authenticateToken, CommentController.updateComment);

/**
 * @swagger
 * /comments/{comment_id}:
 *   delete:
 *     summary: Elimina un comentario existente
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: comment_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del comentario
 *     responses:
 *       200:
 *         description: Comentario eliminado exitosamente
 *       404:
 *         description: Comentario no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/comments/:comment_id', authenticateToken, CommentController.deleteComment);

export default router;
