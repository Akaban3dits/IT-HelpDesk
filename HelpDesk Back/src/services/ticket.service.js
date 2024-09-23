import TicketModel from '../models/ticket.model.js';

class TicketService {
    async createTicket(ticketData) {
        return await TicketModel.create(ticketData);
    }

    async getAllTickets() {
        return await TicketModel.findAll();
    }

    async getTicketById(ticketId) {
        return await TicketModel.findById(ticketId);
    }

    async updateTicket(ticketId, ticketData) {
        return await TicketModel.update(ticketId, ticketData);
    }

    async deleteTicket(ticketId) {
        return await TicketModel.delete(ticketId);
    }
}

export default new TicketService();
