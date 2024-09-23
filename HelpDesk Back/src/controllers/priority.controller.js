import PriorityService from '../services/priority.service.js';

class PriorityController {
    async createPriority(req, res) {
        try {
            const priority = await PriorityService.createPriority(req.body);
            return res.status(201).json(priority);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getAllPriorities(req, res) {
        try {
            const priorities = await PriorityService.getAllPriorities();
            return res.status(200).json(priorities);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getPriorityById(req, res) {
        try {
            const priority = await PriorityService.getPriorityById(req.params.id);
            if (!priority) {
                return res.status(404).json({ message: 'Priority not found' });
            }
            return res.status(200).json(priority);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async updatePriority(req, res) {
        try {
            const updatedPriority = await PriorityService.updatePriority(req.params.id, req.body);
            if (!updatedPriority) {
                return res.status(404).json({ message: 'Priority not found' });
            }
            return res.status(200).json(updatedPriority);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async deletePriority(req, res) {
        try {
            const deletedPriority = await PriorityService.deletePriority(req.params.id);
            if (!deletedPriority) {
                return res.status(404).json({ message: 'Priority not found' });
            }
            return res.status(200).json({ message: 'Priority deleted successfully' });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export default new PriorityController();
