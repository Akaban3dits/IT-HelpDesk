import StatusService from '../services/status.service.js';

class StatusController {

    async getAllStatuses(req, res) {
        try {
            const statuses = await StatusService.getAllStatuses();
            return res.status(200).json(statuses);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getStatusHistoryByFriendlyCode(req, res, next) {
        try {
            const { friendlyCode } = req.params; // Obtener el friendlyCode desde los parámetros de la solicitud

            // Llama al servicio para obtener el historial utilizando el friendlyCode
            const history = await StatusService.getStatusHistoryByFriendlyCode(friendlyCode);

            return res.status(200).json(history); // Retorna el historial en formato JSON
        } catch (error) {
            console.error('Error al obtener el historial de estados:', error);
            next(error); // Enviar el error al middleware de manejo de errores
        }
    }
    
}

export default new StatusController();
