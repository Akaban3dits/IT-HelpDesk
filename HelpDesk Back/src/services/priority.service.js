import priorityModel from '../models/priority.model.js';

class PriorityService {
    //*Servicio en uso
    async getAllPriorities() {
        try {
            const priorities = await priorityModel.findAll();
            return priorities;
        } catch (error) {
            throw error; 
        }
    }
}

export default new PriorityService();
