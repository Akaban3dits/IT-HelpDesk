// src/api/status.js
import apiClient from '../interceptors/apiClient';

export const fetchStatuses = async () => {
    // Esta función no hace nada por ahora
    return [];
};

export const getStatusHistoryByFriendlyCode = async (friendlyCode) => {
    if (!friendlyCode) {
        throw new Error('El código amigable es requerido'); // Asegúrate de manejar la validación de entrada
    }

    try {

        const response = await apiClient.get(`/tickets/${friendlyCode}/status-history`);
        return response.data; // Devuelve los datos del historial
    } catch (error) {
        const errorMessage = error.response?.data?.error || 'Error al obtener el historial de estados';
        console.error('Error fetching status history:', errorMessage); // Log de error
        throw new Error(errorMessage); // Lanza un error para manejar en la capa superior
    }
};

