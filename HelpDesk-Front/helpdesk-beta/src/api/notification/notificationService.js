import apiClient from "../interceptors/apiClient";

export const fetchUserNotifications = async () => {
    try {
        const response = await apiClient.get('/notifications');
        return response.data; // Devuelve las notificaciones
    } catch (error) {
        console.error('Error al obtener las notificaciones:', error.message);
        throw error;
    }
};


// Actualizar una notificación
export const updateNotification = async (notificationId, updates) => {
    try {
        const response = await apiClient.patch(`/notifications/${notificationId}`, updates);
        return response.data; // Devuelve la notificación actualizada
    } catch (error) {
        console.error('Error al actualizar la notificación:', error.message);
        throw error;
    }
};
