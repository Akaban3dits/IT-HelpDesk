import StatusService from '../services/status.service.js';

class StatusController {
    async createStatus(req, res) {
        try {
            const status = await StatusService.createStatus(req.body);
            return res.status(201).json(status);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getAllStatuses(req, res) {
        try {
            const statuses = await StatusService.getAllStatuses();
            return res.status(200).json(statuses);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getStatusById(req, res) {
        try {
            const status = await StatusService.getStatusById(req.params.id);
            if (!status) {
                return res.status(404).json({ message: 'Status not found' });
            }
            return res.status(200).json(status);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async updateStatus(req, res) {
        try {
            const updatedStatus = await StatusService.updateStatus(req.params.id, req.body);
            if (!updatedStatus) {
                return res.status(404).json({ message: 'Status not found' });
            }
            return res.status(200).json(updatedStatus);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async deleteStatus(req, res) {
        try {
            const deletedStatus = await StatusService.deleteStatus(req.params.id);
            if (!deletedStatus) {
                return res.status(404).json({ message: 'Status not found' });
            }
            return res.status(200).json({ message: 'Status deleted successfully' });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export default new StatusController();
