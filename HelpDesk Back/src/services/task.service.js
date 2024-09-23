import TaskModel from '../models/task.model.js';

class TaskService {
    async createTask(taskData) {
        return await TaskModel.create(taskData);
    }

    async getAllTasks() {
        return await TaskModel.findAll();
    }

    async getTaskById(taskId) {
        return await TaskModel.findById(taskId);
    }

    async updateTask(taskId, taskData) {
        return await TaskModel.update(taskId, taskData);
    }

    async deleteTask(taskId) {
        return await TaskModel.delete(taskId);
    }
}

export default new TaskService();
