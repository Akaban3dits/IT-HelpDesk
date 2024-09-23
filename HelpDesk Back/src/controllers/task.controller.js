import TaskService from '../services/task.service.js';

class TaskController {
    async createTask(req, res) {
        try {
            const task = await TaskService.createTask(req.body);
            return res.status(201).json(task);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getAllTasks(req, res) {
        try {
            const tasks = await TaskService.getAllTasks();
            return res.status(200).json(tasks);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getTaskById(req, res) {
        try {
            const task = await TaskService.getTaskById(req.params.id);
            if (!task) {
                return res.status(404).json({ message: 'Task not found' });
            }
            return res.status(200).json(task);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async updateTask(req, res) {
        try {
            const updatedTask = await TaskService.updateTask(req.params.id, req.body);
            if (!updatedTask) {
                return res.status(404).json({ message: 'Task not found' });
            }
            return res.status(200).json(updatedTask);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async deleteTask(req, res) {
        try {
            const deletedTask = await TaskService.deleteTask(req.params.id);
            if (!deletedTask) {
                return res.status(404).json({ message: 'Task not found' });
            }
            return res.status(200).json({ message: 'Task deleted successfully' });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export default new TaskController();
