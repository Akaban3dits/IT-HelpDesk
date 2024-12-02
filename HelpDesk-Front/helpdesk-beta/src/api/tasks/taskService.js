import apiClient from '../interceptors/apiClient';

export const fetchTasksByTicketId = async (ticketId) => {
    try {
        const response = await apiClient.get(`/tickets/${ticketId}/tasks`);
        return response.data; // Devuelve la lista de tareas
    } catch (error) {
        const errorMessage = error.response?.data?.error || 'Error al obtener las tareas';
        console.error('Error al obtener las tareas:', errorMessage);
        throw new Error(errorMessage);
    }
};


export const createTask = async (ticketId, taskData) => {
    try {
        const response = await apiClient.post(`/tickets/${ticketId}/tasks`, taskData);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || 'Error al crear la tarea';
        console.error('Error al crear la tarea:', errorMessage);
        throw new Error(errorMessage);
    }
};



export const updateTask = async (taskId, updateData) => {
    try {
        const response = await apiClient.put(`/tasks/${taskId}`, updateData);
        return response.data; // Devuelve la tarea actualizada
    } catch (error) {
        const errorMessage = error.response?.data?.error || 'Error al actualizar la tarea';
        console.error('Error al actualizar la tarea:', errorMessage);
        throw new Error(errorMessage);
    }
};


export const deleteTask = async (taskId) => {
    try {
        await apiClient.delete(`/tasks/${taskId}`);
    } catch (error) {
        const errorMessage = error.response?.data?.error || 'Error al eliminar la tarea';
        console.error('Error al eliminar la tarea:', errorMessage);
        throw new Error(errorMessage);
    }
};
