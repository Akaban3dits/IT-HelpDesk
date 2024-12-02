import TaskModel from '../models/task.model.js';

class TaskService {
    async createTask(taskData) {
        try {
            return await TaskModel.createTask(taskData);
        } catch (error) {
            console.error('Error al crear la tarea:', error.message);
            throw new Error('No se pudo crear la tarea');
        }
    }

    // Actualizar una tarea
    async updateTask(id, updateData) {
        if (!id) {
            throw new Error('El ID de la tarea es requerido');
        }

        try {
            return await TaskModel.updateTask(id, updateData);
        } catch (error) {
            console.error('Error al actualizar la tarea:', error.message);
            throw new Error('No se pudo actualizar la tarea');
        }
    }

    // Eliminar una tarea
    async deleteTask(id) {
        if (!id) {
            throw new Error('El ID de la tarea es requerido');
        }

        try {
            await TaskModel.deleteTask(id);
        } catch (error) {
            console.error('Error al eliminar la tarea:', error.message);
            throw new Error('No se pudo eliminar la tarea');
        }
    }

    // Obtener tareas por `ticket_id`
    async getTasksByTicketId(ticket_id) {
        if (!ticket_id) {
            throw new Error('El ID del ticket es requerido');
        }

        try {
            return await TaskModel.getTasksByTicketId(ticket_id);
        } catch (error) {
            console.error('Error al obtener las tareas:', error.message);
            throw new Error('No se pudieron obtener las tareas');
        }
    }
}

export default new TaskService();
