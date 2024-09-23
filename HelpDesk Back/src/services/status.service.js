import StatusModel from '../models/status.model.js';

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
}

export default new StatusService();
