import { Router } from 'express';
import TicketController from '../controllers/ticket.controller.js';
import authenticateToken from '../middlewares/auth.js';
import upload from '../config/multerConfig.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Tickets
 *   description: API para la gestión de tickets
 */

/**
 * @swagger
 * /tickets:
 *   get:
 *     summary: Obtiene todos los tickets
 *     tags: [Tickets]
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
 *         description: Lista de tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ticket'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get('/tickets', authenticateToken, TicketController.getAllTickets);

/**
 * @swagger
 * /tickets/{ticket_id}:
 *   get:
 *     summary: Obtiene un ticket por su ID
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: ticket_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del ticket
 *     responses:
 *       200:
 *         description: Detalles de un ticket
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       404:
 *         description: Ticket no encontrado
 *       401:
 *         description: No autorizado
 */
router.get('/tickets/:ticket_id', authenticateToken, TicketController.getTicketById);

/**
 * @swagger
 * /tickets:
 *   post:
 *     summary: Crea un nuevo ticket
 *     tags: [Tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTicketDto'
 *     responses:
 *       201:
 *         description: Ticket creado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error del servidor
 */
router.post('/tickets', authenticateToken, upload.array('attachments', 5), (req, res, next) => {
    // Log para verificar los datos que llegan al servidor

    // Llamar al controlador para continuar con la lógica de creación del ticket
    TicketController.createTicket(req, res, next);
});

/**
 * @swagger
 * /tickets/{ticket_id}:
 *   put:
 *     summary: Actualiza un ticket existente
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: ticket_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del ticket
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTicketDto'
 *     responses:
 *       200:
 *         description: Ticket actualizado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Ticket no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/tickets/:ticket_id', authenticateToken, TicketController.updateTicket);

/**
 * @swagger
 * /tickets/{ticket_id}:
 *   delete:
 *     summary: Elimina un ticket existente
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: ticket_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del ticket
 *     responses:
 *       200:
 *         description: Ticket eliminado exitosamente
 *       404:
 *         description: Ticket no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/tickets/:ticket_id', authenticateToken, TicketController.deleteTicket);

export default router;
