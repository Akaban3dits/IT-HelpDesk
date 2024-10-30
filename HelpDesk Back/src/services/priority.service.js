import PriorityModel from '../models/priority.model.js';

class PriorityService {
    //*Servicio en uso
    async getAllPriorities() {
        return await PriorityModel.findAll();
    }

    //!Servicio sin uso
    async createPriority(priorityData) {
        return await PriorityModel.create(priorityData);
    }


    async getPriorityById(priorityId) {
        return await PriorityModel.findById(priorityId);
    }

    async updatePriority(priorityId, priorityData) {
        return await PriorityModel.update(priorityId, priorityData);
    }

    async deletePriority(priorityId) {
        return await PriorityModel.delete(priorityId);
    }


}

export default new PriorityService();
