import StatusHistoryService from '../services/statusHistory.service.js';

class StatusHistoryController {
    async createStatusHistory(req, res) {
        try {
            const statusHistory = await StatusHistoryService.createStatusHistory(req.body);
            return res.status(201).json(statusHistory);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getAllStatusHistories(req, res) {
        try {
            const statusHistories = await StatusHistoryService.getAllStatusHistories();
            return res.status(200).json(statusHistories);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getStatusHistoryById(req, res) {
        try {
            const statusHistory = await StatusHistoryService.getStatusHistoryById(req.params.id);
            if (!statusHistory) {
                return res.status(404).json({ message: 'Status History not found' });
            }
            return res.status(200).json(statusHistory);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async updateStatusHistory(req, res) {
        try {
            const updatedStatusHistory = await StatusHistoryService.updateStatusHistory(req.params.id, req.body);
            if (!updatedStatusHistory) {
                return res.status(404).json({ message: 'Status History not found' });
            }
            return res.status(200).json(updatedStatusHistory);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async deleteStatusHistory(req, res) {
        try {
            const deletedStatusHistory = await StatusHistoryService.deleteStatusHistory(req.params.id);
            if (!deletedStatusHistory) {
                return res.status(404).json({ message: 'Status History not found' });
            }
            return res.status(200).json({ message: 'Status History deleted successfully' });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export default new StatusHistoryController();
