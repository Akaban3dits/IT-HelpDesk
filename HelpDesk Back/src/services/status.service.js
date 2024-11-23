import statusModel from '../models/status.model.js';
import ticketModel from '../models/ticket.model.js';

class StatusService {
    async getAllStatuses() {
        return await StatusModel.findAll();
    }

    async getStatusHistoryByFriendlyCode(friendly_code) {
        if (!friendly_code) {
            throw new Error('El código amigable es requerido');
        }
    
        try {
            const history = await statusModel.getStatusHistoryByTicketId(friendly_code); // Llama al método para obtener el historial
            return history; // Retorna el historial obtenido
        } catch (error) {
            console.error('Error al obtener el historial de estados:', error.message);
            throw new Error('No se pudo obtener el historial de estados');
        }
    }
    
    
}

export default new StatusService();
