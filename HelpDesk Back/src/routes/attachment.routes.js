import { Router } from 'express';
import AttachmentController from '../controllers/attachment.controller.js';
import authenticateToken from '../middlewares/auth.js';
import upload from '../config/multerConfig.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Attachments
 *   description: API para la gestión de adjuntos
 */

/**
 * @swagger
 * /attachments:
 *   get:
 *     summary: Obtiene todos los adjuntos
 *     tags: [Attachments]
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
 *         description: Lista de adjuntos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Attachment'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get('/attachments', authenticateToken, AttachmentController.getAllAttachments);

/**
 * @swagger
 * /attachments/{attachment_id}:
 *   get:
 *     summary: Obtiene un adjunto por su ID
 *     tags: [Attachments]
 *     parameters:
 *       - in: path
 *         name: attachment_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del adjunto
 *     responses:
 *       200:
 *         description: Detalles de un adjunto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Attachment'
 *       404:
 *         description: Adjunto no encontrado
 *       401:
 *         description: No autorizado
 */
router.get('/attachments/:attachment_id', authenticateToken, AttachmentController.getAttachmentById);

/**
 * @swagger
 * /attachments:
 *   post:
 *     summary: Crea un nuevo adjunto
 *     tags: [Attachments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAttachmentDto'
 *     responses:
 *       201:
 *         description: Adjunto creado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error del servidor
 */
router.post('/attachments', upload.array('files', 5), AttachmentController.createAttachments);

/**
 * @swagger
 * /attachments/{attachment_id}:
 *   put:
 *     summary: Actualiza un adjunto existente
 *     tags: [Attachments]
 *     parameters:
 *       - in: path
 *         name: attachment_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del adjunto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAttachmentDto'
 *     responses:
 *       200:
 *         description: Adjunto actualizado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Adjunto no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/attachments/:attachment_id', authenticateToken, AttachmentController.updateAttachment);

/**
 * @swagger
 * /attachments/{attachment_id}:
 *   delete:
 *     summary: Elimina un adjunto existente
 *     tags: [Attachments]
 *     parameters:
 *       - in: path
 *         name: attachment_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del adjunto
 *     responses:
 *       200:
 *         description: Adjunto eliminado exitosamente
 *       404:
 *         description: Adjunto no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/attachments/:attachment_id', authenticateToken, AttachmentController.deleteAttachment);

export default router;
