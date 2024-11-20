import { Router } from 'express';
import TicketController from '../controllers/ticket.controller.js';
import authenticateToken from '../middlewares/auth.js';
import uploadConfig from '../config/multerConfig.js';

const router = Router();
//* Ruta funcional
router.post(
    '/tickets',
    authenticateToken,
    uploadConfig.initialize().array('attachments', 5),
    (req, res, next) => {
        TicketController.createTicket(req, res, next);
    }
);

router.get('/tickets', authenticateToken, TicketController.gettickets)

router.get(
    '/tickets/:friendlyCode',
    authenticateToken,
    (req, res, next) => {
        console.log("Hola");
        TicketController.getTicketByFriendlyCode(req, res, next);
    }
);

router.get('/tickets-monthly', authenticateToken, async (req, res, next) => {
    try {
        console.log("Hola"); // Verificación de que la ruta está siendo llamada
        await TicketController.getMonthlyTicketCounts(req, res, next);
    } catch (error) {
        console.error("Error en /tickets/monthly:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});


router.get('/tickets-daily-status', authenticateToken, async (req, res, next) => {
    try {
        await TicketController.getDailyTicketStatusCounts(req, res, next);
    } catch (error) {
        console.error("Error en /tickets-daily-status:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

router.put('/tickets/:friendlyCode', authenticateToken, (req, res, next) => {
    TicketController.updateTicket(req, res, next);
});


export default router;
