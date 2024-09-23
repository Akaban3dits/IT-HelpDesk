import StatusHistoryModel from '../models/statusHistory.model.js';

class StatusHistoryService {
    async createStatusHistory(statusHistoryData) {
        return await StatusHistoryModel.create(statusHistoryData);
    }

    async getAllStatusHistories() {
        return await StatusHistoryModel.findAll();
    }

    async getStatusHistoryById(historyId) {
        return await StatusHistoryModel.findById(historyId);
    }

    async updateStatusHistory(historyId, statusHistoryData) {
        return await StatusHistoryModel.update(historyId, statusHistoryData);
    }

    async deleteStatusHistory(historyId) {
        return await StatusHistoryModel.delete(historyId);
    }
}

export default new StatusHistoryService();
