import TicketService from '../services/ticket.service.js';

class TicketController {
    async createTicket(req, res) {
        try {
            const ticket = await TicketService.createTicket(req.body);
            return res.status(201).json(ticket);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getAllTickets(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const tickets = await TicketService.getAllTickets(page, limit);

            res.json(tickets);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los tickets', error: error.message });
        }
    }
    async getTicketById(req, res) {
        try {
            const ticketId = req.params.id;
            const ticket = await TicketService.getTicketWithDetails(ticketId);

            if (!ticket) {
                return res.status(404).json({ message: 'Ticket no encontrado' });
            }

            res.json(ticket);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el ticket', error: error.message });
        }
    }

    async updateTicket(req, res) {
        try {
            const updatedTicket = await TicketService.updateTicket(req.params.id, req.body);
            if (!updatedTicket) {
                return res.status(404).json({ message: 'Ticket not found' });
            }
            return res.status(200).json(updatedTicket);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async deleteTicket(req, res) {
        try {
            const deletedTicket = await TicketService.deleteTicket(req.params.id);
            if (!deletedTicket) {
                return res.status(404).json({ message: 'Ticket not found' });
            }
            return res.status(200).json({ message: 'Ticket deleted successfully' });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export default new TicketController();
