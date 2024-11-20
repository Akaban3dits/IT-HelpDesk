import PriorityService from '../services/priority.service.js';

class PriorityController {

    //Funcionalidad comprobada y correcta
    async getAllPriorities(req, res) {
        try {
            //Extraer prioridades del servicio (todas)
            const priorities = await PriorityService.getAllPriorities();
            return res.status(200).json(priorities);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export default new PriorityController();
