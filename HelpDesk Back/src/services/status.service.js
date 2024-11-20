import statusModel from '../models/status.model.js';
import ticketModel from '../models/ticket.model.js';

class StatusService {
    async createStatus(statusData) {
        return await StatusModel.create(statusData);
    }

    async getAllStatuses() {
        return await StatusModel.findAll();
    }

    async getStatusById(statusId) {
        return await StatusModel.findById(statusId);
    }

    async updateStatus(statusId, statusData) {
        return await StatusModel.update(statusId, statusData);
    }

    async deleteStatus(statusId) {
        return await StatusModel.delete(statusId);
    }

    async getStatusHistoryByFriendlyCode(friendly_code) {
        if (!friendly_code) {
            throw new Error('El código amigable es requerido');
        }
    
        try {
            const ticket = await ticketModel.findByFriendlyCode(friendly_code);
            if (!ticket) {
                throw new Error('Ticket no encontrado');
            }
    
            const ticketId = ticket.id; // Asegúrate de que ticket.id es del tipo correcto
    
            const history = await statusModel.getStatusHistoryByTicketId(ticketId); // Llama al método para obtener el historial
            return history; // Retorna el historial obtenido
        } catch (error) {
            console.error('Error al obtener el historial de estados:', error.message);
            throw new Error('No se pudo obtener el historial de estados');
        }
    }
    
    
}

export default new StatusService();
