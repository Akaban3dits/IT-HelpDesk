import TaskService from '../services/task.service.js';

class TaskController {
    // Crear una nueva tarea
    async createTask(req, res, next) {
        try {
    
            const { task_description } = req.body;
            const { ticket_id } = req.params;
    
            if (!ticket_id) {
                throw new Error('El ID del ticket es obligatorio.');
            }
    
            const task = await TaskService.createTask({ task_description, ticket_id });
    
            res.status(201).json(task);
        } catch (error) {
            next(error);
        }
    }
    
    

    // Actualizar una tarea
    async updateTask(req, res, next) {
        try {
            const { id } = req.params;
            const { task_description, is_completed } = req.body;
            const updatedTask = await TaskService.updateTask(id, { task_description, is_completed });
            res.status(200).json(updatedTask);
        } catch (error) {
            console.error('Error al actualizar la tarea:', error);
            next(error);
        }
    }

    // Eliminar una tarea
    async deleteTask(req, res, next) {
        try {
            const { id } = req.params;
            await TaskService.deleteTask(id);
            res.status(204).send();
        } catch (error) {
            console.error('Error al eliminar la tarea:', error);
            next(error);
        }
    }

    // Obtener tareas por `ticket_id`
    async getTasksByTicketId(req, res, next) {
        try {
            const { ticket_id } = req.params;
            const tasks = await TaskService.getTasksByTicketId(ticket_id);
            res.status(200).json(tasks);
        } catch (error) {
            console.error('Error al obtener las tareas:', error);
            next(error);
        }
    }
}

export default new TaskController();
